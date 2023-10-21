module "vpc" {
  source = "./modules/vpc"
}

module "lambda" {
  source     = "./modules/lambda"
  subnet_ids = module.vpc.subnet_ids
  account_id = data.aws_caller_identity.this.account_id
  vpc_info   = module.vpc.vpc_info
  depends_on = [module.vpc]
}

module "api-gw" {
  source      = "./modules/api-gw"
  lambda_arns = module.lambda.lambda_invoke_arns
  depends_on  = [module.lambda]
}

module "S3" {
  source     = "./modules/S3"
  account_id = data.aws_caller_identity.this.account_id
}

module "acm" {
  source      = "./modules/acm"
  domain_name = var.domain_name
}

module "cloudfront" {
  source                      = "./modules/cloudfront"
  domain_name                 = var.domain_name
  certificate_arn             = module.acm.certificate_arn
  bucket_origin_id            = module.S3.frontend_bucket_id
  bucket_regional_domain_name = module.S3.frontend_bucket_rdn
  bucket_arn                  = module.S3.frontend_bucket_arn
  aliases                     = [var.subdomain_www, var.domain_name]
  depends_on                  = [module.acm]
}

module "route53" {
  source      = "./modules/route53"
  domain_name = var.domain_name
  cdn         = module.cloudfront.cloudfront_distribution
  depends_on  = [module.cloudfront]
}

module "eventbridge" {
  source      = "./modules/eventbridge"
  lambda_arns = module.lambda.lambda_arns
  depends_on  = [module.lambda]
}

module "WAF" {
  source      = "./modules/WAF"
}
