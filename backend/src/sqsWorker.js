const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const crypto = require('crypto');

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

async function pollSQS() {
    if (!QUEUE_URL) return;

    try {
        const data = await sqs.send(new ReceiveMessageCommand({
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5 // Long polling
        }));

        if (data.Messages && data.Messages.length > 0) {
            for (const msg of data.Messages) {
                
                // This blocks the event loop, starving the Game of Life engine
                crypto.pbkdf2Sync('chaos-password', 'salt', 100000, 64, 'sha512');
                
                await sqs.send(new DeleteMessageCommand({
                    QueueUrl: QUEUE_URL,
                    ReceiptHandle: msg.ReceiptHandle
                }));
            }
        }
    } catch (err) {
        console.error("SQS Polling Error:", err);
    }

    // Schedule next poll immediately using setImmediate to allow other I/O to process
    setImmediate(pollSQS);
}

function startSqsWorker() {
    console.log("Starting SQS Worker...");
    pollSQS();
}

module.exports = { startSqsWorker };