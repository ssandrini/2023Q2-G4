variable "lambda_arns" {
  type        = map(string)
  description = "Lambda functions ARNs"
}

# variable "user_pool_arn" {
#   type        = string
#   description = "User Pool ARN"
# }

variable "account_id" {
  type        = string
  description = "Account id"
}
