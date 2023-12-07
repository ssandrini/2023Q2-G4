variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "santiagosandrini.com.ar"
}

variable "subdomain_www" {
  description = "Subdomain name"
  type        = string
  default     = "www.santiagosandrini.com.ar"
}


variable "db_user" {
  description = "User of the database"
  type        = string
  default     = "Leandro"
}

variable "db_pass" {
  description = "Password of the database"
  type        = string
  sensitive   = true
  default     = "LeandroEsUnCapo123"
}

variable "db_name" {
  description = "primary"
  type        = string
  default     = "primarydb"
}

variable "db_port" {
  default = 5432
}