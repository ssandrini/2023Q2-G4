variable "domain_name" {
  description  = "Domain name"
  type         = string
}

variable "bucket_regional_domain_name" {
  description  = "Static site bucket regional domain name"
  type         = string
}

variable "bucket_arn" {
  description  = "Static site bucket arn"
  type         = string
}

variable "bucket_origin_id" {
  description  = "CDN origin bucket id"
  type         = string
}

variable "redirect_bucket_id" {
  description  = "CDN redirect bucket id"
  type         = string
}

variable "certificate_arn" {
  description  = "Certificate ARN"
  type         = string
}