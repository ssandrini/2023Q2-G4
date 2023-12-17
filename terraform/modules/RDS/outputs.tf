output "proxy_arn" {
  description = "Proxy endpoint"
  value       = aws_db_proxy.my_rds_proxy.endpoint
}

output "rds_sg_id" {
  value = aws_security_group.rds.id
}