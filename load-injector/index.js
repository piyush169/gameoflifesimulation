const { SQSClient, SendMessageBatchCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.handler = async (event) => {
    if (!QUEUE_URL) {
        console.error("Missing SQS_QUEUE_URL environment variable.");
        return { statusCode: 500, body: "Configuration Error" };
    }

    console.log("Commencing chaos injection: Flooding SQS Queue...");

    const TOTAL_MESSAGES = 1000;
    const BATCH_SIZE = 10; // AWS SQS maximum batch size
    const totalBatches = TOTAL_MESSAGES / BATCH_SIZE;
    const batchPromises = [];

    for (let i = 0; i < totalBatches; i++) {
        // Build a batch of 10 payload entries
        const entries = Array.from({ length: BATCH_SIZE }, (_, index) => ({
            Id: `msg-${i}-${index}-${Date.now()}`,
            MessageBody: JSON.stringify({
                type: "CHAOS_SPIKE",
                timestamp: new Date().toISOString(),
                complexity: "HIGH"
            })
        }));

        const command = new SendMessageBatchCommand({
            QueueUrl: QUEUE_URL,
            Entries: entries
        });

        // Push execution promise to parallel array
        batchPromises.push(sqs.send(command));
    }

    try {
        // Fire all batches concurrently into SQS
        const results = await Promise.all(batchPromises);
        console.log(`Successfully injected ${TOTAL_MESSAGES} chaos tasks across ${results.length} batches.`);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Spike injected successfully", messagesSent: TOTAL_MESSAGES })
        };
    } catch (error) {
        console.error("Failed to fully execute chaos burst:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};