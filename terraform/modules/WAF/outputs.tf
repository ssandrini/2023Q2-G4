output "waf_acl_id" {
  description = "ID of the created WAF ACL"
  value       = aws_wafv2_web_acl.waf-rate-acl.id
}
