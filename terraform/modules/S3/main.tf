#resource "random_pet" "logs_bucket_name" {
#  prefix = "bucket"
#  length = 4
#}

### frontend:

resource "aws_s3_bucket" "static_page_bucket" {
  bucket        = "static-page-bucket-42636985"

  website {
    index_document = "index.html"
  }

  tags = {
    Name = "Mi Página Web Simple"
  }
  force_destroy = true

    acl    = "public-read"

}

resource "aws_s3_bucket_object" "frontend_html" {
  bucket = aws_s3_bucket.static_page_bucket.id
  key    = "index.html"
  source = "resources/frontend/index.html"
  content_type = "text/html"
  acl    = "public-read"
}

resource "aws_s3_bucket_object" "frontend_css" {
  bucket = aws_s3_bucket.static_page_bucket.id
  key    = "styles.css"
  source = "resources/frontend/styles.css"
  content_type = "text/css"
  acl    = "public-read"
}

resource "aws_s3_bucket_object" "frontend_js" {
  bucket = aws_s3_bucket.static_page_bucket.id
  key    = "script.js"
  source = "resources/frontend/script.js"
  content_type = "application/javascript"
  acl    = "public-read"
}

resource "aws_s3_bucket_ownership_controls" "static_page_bucket" {
  bucket = aws_s3_bucket.static_page_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "static_page_bucket" {
  bucket = aws_s3_bucket.static_page_bucket.id
  # TODO: check si falta algo mas
  restrict_public_buckets = false
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
}

resource "aws_s3_bucket_acl" "static_page_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.static_page_bucket,
    aws_s3_bucket_public_access_block.static_page_bucket,
  ]

  bucket = aws_s3_bucket.static_page_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_logging" "static_page_log" {
  bucket        = aws_s3_bucket.static_page_bucket.id
  target_bucket = aws_s3_bucket.log_bucket2.id
  target_prefix = "log/"
}
#### ^^




### www:

resource "aws_s3_bucket" "www_bucket" {
  bucket        = "www-bucket-42636985"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "www_bucket" {
  bucket = aws_s3_bucket.www_bucket.id

  # TODO: check si falta algo mas
  restrict_public_buckets = true
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
}
resource "aws_s3_bucket_website_configuration" "redirect_config" {
  bucket = aws_s3_bucket.www_bucket.id

  redirect_all_requests_to {
    protocol  = "http"
    host_name = "example.com"
  }
}

resource "aws_s3_bucket_ownership_controls" "redirect" {
  bucket = aws_s3_bucket.www_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

#resource "aws_s3_bucket_policy" "redirect_policy" {
#  bucket = aws_s3_bucket.www_bucket.id
#  policy = data.aws_iam_policy_document.redirect_iam.json
#}

data "aws_iam_policy_document" "redirect_iam" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::account-id:cloudfront/oai/oai-id"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      aws_s3_bucket.www_bucket.arn,
      "${aws_s3_bucket.www_bucket.arn}/*",
    ]
  }
}


#### ^^

### logs bucket: 
#TODO : a chequiar tema permisos, si está todo publico nos matan
resource "aws_s3_bucket" "log_bucket2" {
  bucket        = "logs-bucket-426369"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "log_bucket_versioning" {
  bucket = aws_s3_bucket.log_bucket2.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "log_bucket2" {
  bucket = aws_s3_bucket.log_bucket2.id
  # TODO: check si falta algo mas
  restrict_public_buckets = false
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false #TODO make private
}
resource "aws_s3_bucket_ownership_controls" "log_bucket2" {
  bucket = aws_s3_bucket.log_bucket2.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "log_bucket2" {
  depends_on = [aws_s3_bucket_ownership_controls.log_bucket2]

  bucket = aws_s3_bucket.log_bucket2.id
  acl    = "log-delivery-write"
}
##### ^^