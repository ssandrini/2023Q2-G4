variable "subnet_ids" {
  type        = list(any)
  description = "List of lambda VPC subnet ids"
}

variable "account_id" {
  type        = string
  description = "Current account ID"
}

variable "vpc_info" {
  description = "Information about the VPC"
  type        = map(string)
}

variable "db_user" {
  type = string
}

variable "db_pass" {
  type = string
}

variable "proxy_arn" {
  type = string
}

variable "db_name" {
  type = string
}

variable "sns_topic_arn" {
  type = string
}

variable "rds_sg_id" {
  type = string
}

variable "sns_endpoint_sg_id" {
  type = string
}