# Paste your manually created Lambda execution role and EventBridge role here
locals {
  lambda_role_arn      = "arn:aws:iam::710590321638:role/gol-lambda-execution-role"
  scheduler_role_arn   = "arn:aws:iam::710590321638:role/gol-eventbridge-scheduler-role"
}

# Dummy archive to allow initial Terraform apply without breaking
data "archive_file" "dummy_lambda" {
  type        = "zip"
  output_path = "${path.module}/dummy_lambda.zip"
  source {
    content  = "exports.handler = async () => { console.log('placeholder'); }"
    filename = "index.js"
  }
}

# The Load Injector Lambda Function
resource "aws_lambda_function" "load_injector" {
  filename         = data.archive_file.dummy_lambda.output_path
  function_name    = "gol-chaos-load-injector"
  role             = local.lambda_role_arn
  handler          = "index.js"
  runtime          = "nodejs18.x"
  timeout          = 300 # 5-minute limit for heavy batch execution

  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.chaos_queue.url
    }
  }
}

# EventBridge Scheduler to trigger the surge phase
resource "aws_scheduler_schedule" "surge_trigger" {
  name       = "gol-chaos-surge-schedule"
  group_name = "default"

  flexible_time_window {
    mode = "OFF"
  }

  # Triggers every 10 minutes to spike the queue
  schedule_expression = "rate(10 minutes)"

  target {
    arn      = aws_lambda_function.load_injector.arn
    role_arn = local.scheduler_role_arn

    retry_policy {
      maximum_retry_attempts       = 0
      maximum_event_age_in_seconds = 60
    }
  }
}