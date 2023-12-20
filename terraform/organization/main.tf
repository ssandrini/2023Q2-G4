module "vpc" {
  source = "../modules/vpc"
}

module "lambda" {
  source             = "../modules/lambda"
  subnet_ids         = [module.vpc.subnet_ids[0], module.vpc.subnet_ids[1]]
  account_id         = data.aws_caller_identity.this.account_id
  vpc_info           = module.vpc.vpc_info
  depends_on         = [module.vpc]
  proxy_arn          = module.RDS.proxy_arn
  db_name            = var.db_name
  db_pass            = var.db_pass
  db_user            = var.db_user
  sns_topic_arn      = module.sns.sns_topic_arn
  rds_sg_id          = module.RDS.rds_sg_id
  sns_endpoint_sg_id = module.sns.sns_endpoint_sg_id
}

module "api-gw" {
  source      = "../modules/api-gw"
  lambda_arns = module.lambda.lambda_invoke_arns
  user_pool_arn = module.cognito.user_pool_arn
  account_id    = data.aws_caller_identity.this.account_id
  depends_on  = [module.lambda]
}

module "S3" {
  source     = "../modules/S3"
  account_id = data.aws_caller_identity.this.account_id
}

module "acm" {
  source      = "../modules/acm"
  domain_name = var.domain_name
}

module "cloudfront" {
  source                      = "../modules/cloudfront"
  domain_name                 = var.domain_name
  certificate_arn             = module.acm.certificate_arn
  bucket_origin_id            = module.S3.frontend_bucket_id
  bucket_regional_domain_name = module.S3.frontend_bucket_rdn
  bucket_arn                  = module.S3.frontend_bucket_arn
  aliases                     = [var.subdomain_www, var.domain_name]
  waf_arn                     = module.WAF.waf_acl_arn
  depends_on                  = [module.acm, module.WAF]
}

module "route53" {
  source      = "../modules/route53"
  domain_name = var.domain_name
  cdn         = module.cloudfront.cloudfront_distribution
  depends_on  = [module.cloudfront]
}

module "eventbridge" {
  source      = "../modules/eventbridge"
  lambda_arns = module.lambda.lambda_arns
  depends_on  = [module.lambda]
}

module "WAF" {
  source = "../modules/WAF"
}

module "RDS" {
  source = "../modules/RDS"

  vpc_id     = module.vpc.main_vpc_id
  vpc_cidr   = module.vpc.vpc_info.vpc_cidr
  db_subnets = [module.vpc.subnet_ids[2], module.vpc.subnet_ids[3]]
  db_name    = var.db_name
  db_port    = var.db_port
  db_pass    = var.db_pass
  db_user    = var.db_user
  account_id = data.aws_caller_identity.this.account_id
}

module "sns" {
  source     = "../modules/sns"
  account_id = data.aws_caller_identity.this.account_id
  vpc_info   = module.vpc.vpc_info
  lambda_sg_id = module.lambda.sg_id
  subnet_ids   = [module.vpc.subnet_ids[0], module.vpc.subnet_ids[1]]
}

module "cognito" {
  source = "../modules/cognito"
}

module "backup" {
  source     = "../modules/backup"
  account_id = data.aws_caller_identity.this.account_id
  primary_db_arn = module.RDS.primary_db_arn
}