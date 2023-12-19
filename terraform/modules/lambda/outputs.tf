output "lambda_invoke_arns" {
  description = "Invoke ARN for Lambda functions"
  value = {
    for function_name, lambda_config in local.lambda_functions :
    function_name => aws_lambda_function.lambda_functions[lambda_config.function_name].invoke_arn
  }
}

output "lambda_arns" {
  description = "ARN for Lambda functions"
  value = {
    for function_name, lambda_config in local.lambda_functions :
    function_name => aws_lambda_function.lambda_functions[lambda_config.function_name].arn
  }
}

output "sg_id" {
  value = aws_security_group.lambda_sg.id
}