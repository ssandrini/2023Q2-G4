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
}

module "rds" {
    source = "./modules/rds"
    account_id = data.aws_caller_identity.this.account_id
}