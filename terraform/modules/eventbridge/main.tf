resource "aws_cloudwatch_event_rule" "twice_daily_rule" {
  name        = "TwiceDailyRule"
  description = "Trigger Lambda checkDeadlines twice a day"

  schedule_expression = "rate(60 minutes)" # We leave this for academic purposes, to check if the Lambda is being invoked
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.twice_daily_rule.name
  target_id = "InvokeLambdaTarget"
  arn       = var.lambda_arns["checkDeadlines"]
}

resource "aws_lambda_permission" "eventbridge_permission" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "checkDeadlines"
  principal     = "events.amazonaws.com"

  source_arn = aws_cloudwatch_event_rule.twice_daily_rule.arn
}


