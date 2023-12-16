resource "random_pet" "unique_lambda_bucket_name" {
  prefix = "lambda"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = random_pet.unique_lambda_bucket_name.id
  force_destroy = true
}

resource "aws_kms_key" "lambda_bucket" {
  deletion_window_in_days = 10
  enable_key_rotation     = true
}
resource "aws_s3_bucket_server_side_encryption_configuration" "enforce_encryption" {
  bucket = random_pet.unique_lambda_bucket_name.id

  rule {
    bucket_key_enabled = true

    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.lambda_bucket.arn
    }
  }
}

resource "aws_s3_bucket_public_access_block" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id

  restrict_public_buckets = true
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
}

resource "aws_security_group" "lambda_sg" {
  name_prefix = "lambda-sg-"
  vpc_id      = var.vpc_info.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_info.vpc_cidr]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [var.vpc_info.vpc_cidr]
  }
}

# data "archive_file" "lambda_zips" { //todo remove
#   for_each = local.lambda_functions

#   type        = "zip"
#   source_file = each.value.source_code_file
#   output_path = format("%s/%s.zip", local.zip_target_dir, each.value.function_name)
# }

resource "aws_s3_object" "lambda_objects" {
  for_each = local.lambda_functions

  bucket = aws_s3_bucket.lambda_bucket.id
  key    = each.value.function_name
  source = format("%s/%s.zip", local.zip_target_dir, each.value.function_name)
  etag   = filemd5(format("%s/%s.zip", local.zip_target_dir, each.value.function_name))
}


resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "../resources/lambda/pg.zip" //todo make var
  layer_name = "pg-dependency"
  
  compatible_runtimes = ["nodejs16.x"]
}

resource "aws_lambda_function" "lambda_functions" {
  for_each = local.lambda_functions

  layers = [aws_lambda_layer_version.lambda_layer.arn]

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  role      = local.lab_role

  function_name = each.value.function_name
  s3_key        = each.value.function_name
  runtime       = each.value.runtime
  handler       = each.value.handler

  # source_code_hash = data.archive_file.lambda_zips[each.key].output_base64sha256 //?
  vpc_config {
    subnet_ids         = [var.subnet_ids[0]]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  depends_on = [aws_s3_object.lambda_objects]
}
