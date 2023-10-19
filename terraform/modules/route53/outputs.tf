output "hosted_zone_id" {
  description = "hosted_zone_id"
  value       = aws_route53_zone.primary.zone_id
}

output "certificate_arn" {
 description = "Certificate amazon resource number"
 value       = aws_acm_certificate.acm_certificate.arn
}