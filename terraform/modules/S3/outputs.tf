#output "website_endpoint" {
#  value = aws_s3_bucket.static_website.website_endpoint
#}

output "website_endpoint" {
  value = aws_s3_bucket.static_page_bucket.website_endpoint
}