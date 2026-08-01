# Paste your manually created Lambda execution role and EventBridge role here
locals {
  lambda_role_arn    = "arn:aws:iam::325011900853:role/gol-lambda-execution-role"
  scheduler_role_arn = "arn:aws:iam::325011900853:role/gol-eventbridge-scheduler-role"
}

# The Load Injector Lambda Function
resource "aws_lambda_function" "load_injector" {
  filename         = "lambda_payload.zip"
  source_code_hash = filebase64sha256("lambda_payload.zip")
  function_name    = "gol-chaos-load-injector"
  role          = local.lambda_role_arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 300 # 5-minute limit for heavy batch execution

  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.chaos_queue.url
    }
  }
}
