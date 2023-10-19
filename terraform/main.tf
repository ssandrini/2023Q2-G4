module "vpc" {
  source = "./modules/vpc"
}

module "lambda" {
  source     = "./modules/lambda"
  subnet_ids = module.vpc.subnet_ids
  account_id = data.aws_caller_identity.this.account_id
  vpc_id     = module.vpc.main_vpc_id
  api_gw_execution_arn = module.api-gw.execution_arn
}

module "api-gw" {
  source = "./modules/api-gw"
  lambda_fun = module.lambda.invoke_arn
}

module "S3" {
    source = "./modules/S3"
    account_id = data.aws_caller_identity.this.account_id
}

module "cloudfront" {
  source = "./modules/cloudfront"
  domain_name = "santiagosandrini.com.ar"
  certificate_arn = ""
  bucket_origin_id = module.S3.frontend_bucket_id
  redirect_bucket_id = module.S3.redirect_bucket_id
  bucket_regional_domain_name = module.S3.frontend_bucket_rdn # TODO: check
  bucket_arn = module.S3.frontend_bucket_arn
}

module "route53" {
  source = "./modules/route53"
  domain_name = "santiagosandrini.com.ar"
  cdn = module.cloudfront.cloudfront_distribution
}