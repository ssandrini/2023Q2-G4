output "all" {
  value = [
    module.vpc.*,
    module.lambda.*,
    module.api-gw.*,
    # module.acm.*,
    # module.cloudfront.*,
    module.S3.*,
    module.WAF
  ]
}