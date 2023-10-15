variable "subnet_ids" {
  type        = list(any)
  description = "List of lambda VPC subnet ids"
}

variable "account_id" {
  type        = string
  description = "Current account ID"
}

variable "vpc_id" {
  type        = string
  description = "main vpc ID"
}