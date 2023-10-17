locals {

  lab_role = "arn:aws:iam::${var.account_id}:role/LabRole"
  db_name = "postgresql-db"
  region  = "us-east-1"


  db_user               = "thisismyusername"
  db_password           = "placeholderpasswd"
  engine                = "postgres"
  engine_version        = "13.4"
  family                = "postgres13" # DB parameter group
  major_engine_version  = "13"         # DB option group
  instance_class        = "db.t3.micro"
  allocated_storage     = 10
  max_allocated_storage = 10
  db_port               = 5432
}
