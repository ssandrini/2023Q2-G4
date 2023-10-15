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
}

resource "aws_s3_bucket_object" "frontend" {
  bucket = aws_s3_bucket.static_page_bucket.id
  key    = "index.html"
  source = "resources/frontend/index.html"
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

# WIP
# resource "aws_s3_bucket_policy" "static_page_policy" {
#   bucket = aws_s3_bucket.static_page_bucket.id
#   policy = data.aws_iam_policy_document.static_page_iam.json
# }

#data "aws_iam_policy_document" "static_page_iam" {
#  statement {
#    principals {
#      type        = "AWS"
#      #identifiers = var.bucket_access_oai #wtf?
#    }
#
#    actions = [
#      "s3:GetObject",
#    ]
#
#    resources = [
#      aws_s3_bucket.static_page_bucket.arn,
#      "${aws_s3_bucket.static_page_bucket.arn}/*",
#    ]
#  }
#}

resource "aws_s3_bucket_logging" "static_page_log" {
  bucket        = aws_s3_bucket.static_page_bucket.id
  target_bucket = aws_s3_bucket.logs_bucket.id
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
#### ^^



### logs bucket: 
resource "aws_s3_bucket" "logs_bucket" {
  bucket        = "logs-bucket-42636985"
  force_destroy = true
}
resource "aws_s3_bucket_public_access_block" "logs_bucket" {
  bucket = aws_s3_bucket.logs_bucket.id

  # TODO: check si falta algo mas
  restrict_public_buckets = true
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
}
##### ^^