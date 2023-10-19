resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = var.bucket_regional_domain_name
    origin_id                = var.bucket_origin_id
    s3_origin_config {
        origin_access_identity = aws_cloudfront_origin_access_identity.cloudfront_OAI.cloudfront_access_identity_path
    }
  }

  # TODO: origin for API

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # logging_config {
  #   include_cookies = false
  #   bucket          = "mylogs.s3.amazonaws.com"
  #   prefix          = "myprefix"
  # }

  # aliases = ["mysite.example.com", "yoursite.example.com"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.bucket_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    # TODO: redirect-to-https
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    # TODO: cache policy?
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true

    # TODO: creo que aca va false y se pone nuestro certificate.
  }
}

resource "aws_cloudfront_origin_access_identity" "cloudfront_OAI" {
  comment = "OAI"
}

resource "aws_s3_bucket_policy" "OAI_policy" {
  bucket = var.bucket_origin_id
  policy = data.aws_iam_policy_document.frontend_OAI_policy.json
}