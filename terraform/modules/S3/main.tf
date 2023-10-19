# TODO agregar guion a los bucket_prefix
module "frontend_bucket" {

  force_destroy = true
  source = "terraform-aws-modules/s3-bucket/aws"

  # las block public policies estan habilitadas por defecto
  #block_public_acls       = true
  #block_public_policy     = true
  #ignore_public_acls      = true
  #restrict_public_buckets = true
  bucket_prefix = "frontend"

  # attach_policy = true
  # policy = data.aws_iam_policy_document.frontend_bucket_policy.json

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = var.sse_algorithm
      }
    }
  }

  website = {
    index_document = var.index_document
  }

  versioning = {
    status     = true
    mfa_delete = false
  }

  logging = {
    target_bucket = module.logs_bucket.s3_bucket_id
    target_prefix = "logs/"
  }
}

module "logs_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"    # extern module

  bucket_prefix = "logs"                            # para asegurar nombre unico
  force_destroy = true
  # esta bien encriptar?
  attach_deny_unencrypted_object_uploads = true
  attach_deny_insecure_transport_policy = true
  attach_require_latest_tls_policy      = true
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = var.sse_algorithm
      }
    }
  }

}

module "redirect_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"    # extern module

  bucket_prefix = "www"                             # para asegurar nombre unico
  force_destroy = true

  website = {
    redirect_all_requests_to = {
      host_name = module.frontend_bucket.s3_bucket_bucket_regional_domain_name
    }
  }
}


resource "aws_s3_object" "data" {
  for_each = { for file in local.files : file.dest => file }

  bucket = module.frontend_bucket.s3_bucket_id

  key    = each.value.dest
  source = each.value.source
  content_type = each.value.content_type
  etag         = filemd5(each.value.source)
}