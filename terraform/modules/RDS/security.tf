resource "aws_security_group" "rds" {
  name   = "terraform_rds_security_group"
  vpc_id = var.vpc_id
}