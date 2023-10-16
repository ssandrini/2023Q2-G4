output "lambda_arns" {
  description = "Invoke ARN for Lambda functions"
  value = {
    for function_name, lambda_config in local.lambda_functions :
      function_name => aws_lambda_function.lambda_functions[lambda_config.function_name].invoke_arn
  }
}
