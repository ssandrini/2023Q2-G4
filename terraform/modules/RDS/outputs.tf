output "proxy_arn" {
  description = "Proxy endpoint"
  value       = aws_db_proxy.my_rds_proxy.endpoint
}