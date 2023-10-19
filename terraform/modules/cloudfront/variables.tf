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

variable "certificate_arn" {
  description  = "Certificate ARN"
  type         = string
}

variable "aliases" {
  description  = "Alternate domain names"
  type         = set(string)
}