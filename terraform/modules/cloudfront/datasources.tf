#https://docs.aws.amazon.com/es_es/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html

#data "aws_cloudfront_cache_policy" "optimized_policy" {
#  name = "Managed-CachingOptimized"
#}

# fuente: https://repost.aws/knowledge-center/cloudfront-access-to-amazon-s3

data "aws_iam_policy_document" "frontend_bucket_policy" {
  statement {
    sid       = "AllowCloudFrontServicePrincipalReadOnly"
    effect    = "Allow"
    resources = [var.bucket_arn]

    actions = [
      "s3:GetObject",
    ]

    
    #condition {
    #  test     = "StringEquals"
    #  variable = "AWS:SourceArn"
    #  values   = [aws_cloudfront_distribution.s3_distribution.id]
    #}

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "frontend_OAI_policy" {
  statement {
    sid     = "PublicReadGetObject"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.cloudfront_OAI.iam_arn]
    }
    resources = ["${var.bucket_arn}/*"]
  }
}