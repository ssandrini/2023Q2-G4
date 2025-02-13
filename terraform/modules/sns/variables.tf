variable "account_id" {
  type        = string
  description = "Current account ID"
}

variable "vpc_info" {
  description = "Information about the VPC"
  type        = map(string)
}

variable "lambda_sg_id" {
  type = string
}

variable "subnet_ids" {
  type        = list(any)
  description = "List of lambda VPC subnet ids"
}