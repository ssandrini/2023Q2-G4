module "vpc" {
  source = "../vpc"  
}

resource "aws_db_instance" "example" {
  allocated_storage     = local.allocated_storage
  max_allocated_storage = local.max_allocated_storage
  multi_az              = true
  db_name              = "example"
  engine               = local.engine
  engine_version       = local.engine_version
  instance_class       = local.instance_class
  username             = local.db_user
  password             = local.db_password
  port                 = local.db_port
  db_subnet_group_name = aws_db_subnet_group.this.name


  skip_final_snapshot = true

  tags = {
    name = local.db_name
  }
}

resource "aws_db_subnet_group" "this" {
  name       = "db_subnet_group-167281"
  subnet_ids = tolist(module.vpc.subnet_ids)

  tags = {
    name = "db_subnet_group"
  }
}

resource "aws_db_proxy" "example" {
  name                   = "example"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = local.lab_role
  vpc_security_group_ids = [aws_security_group.example.id]
  vpc_subnet_ids         = tolist(module.vpc.subnet_ids)


  auth {
    auth_scheme = "SECRETS"
    description = "example"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.example.arn
  }

  tags = {
    Name = "example"
    Key  = "value"
  }
}


resource "aws_secretsmanager_secret" "example" {
  name = "example"
}

resource "aws_security_group" "example" {
  name_prefix = "example-db-"
}

resource "aws_db_proxy_default_target_group" "example" {
  db_proxy_name = aws_db_proxy.example.name

  connection_pool_config {
    connection_borrow_timeout    = 120
    init_query                   = "SET x=1, y=2"
    max_connections_percent      = 100
    max_idle_connections_percent = 50
    session_pinning_filters      = ["EXCLUDE_VARIABLE_SETS"]
  }
}

resource "aws_db_proxy_target" "example" {
  db_proxy_name = aws_db_proxy.example.name
  #target_group_name = aws_db_proxy_default_target_group.example.target_group_name
  target_group_name = "example-target-group"
  db_instance_identifier = aws_db_instance.example.id
  
}
