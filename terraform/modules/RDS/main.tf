resource "aws_db_subnet_group" "database" {
  name       = "my-test-database-subnet-group"
  subnet_ids = var.db_subnets
}

resource "aws_db_parameter_group" "database" {
  name   = "database"
  family = "postgres13"
}

resource "aws_db_instance" "primary_db" {
  identifier = var.db_name
  db_name    = var.db_name
  port       = var.db_port

  engine                = "postgres" //todo make vars:
  engine_version        = "13"
  instance_class        = "db.t3.micro"
  allocated_storage     = 5
  max_allocated_storage = 10
  multi_az = true

  username = var.db_user
  password = var.db_pass

  db_subnet_group_name   = aws_db_subnet_group.database.id
  parameter_group_name   = aws_db_parameter_group.database.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Backups are required in order to create a replica
  # maintenance_window      = "Mon:00:00-Mon:03:00"
  # backup_window           = "03:00-06:00"
  # backup_retention_period = 5

  storage_encrypted = false //todo make true
  # kms_key_id                      = aws_kms_key.db.arn
  # performance_insights_enabled    = true
  # performance_insights_kms_key_id = aws_kms_key.db.arn

  skip_final_snapshot = true
  # apply_immediately   = true
}


###### proxy:

resource "aws_db_proxy" "my_rds_proxy" {
  name                   = "my-rds-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = false //todo make true
  role_arn               = local.lab_role
  vpc_security_group_ids = [aws_security_group.rds.id]
  vpc_subnet_ids         = var.db_subnets

  auth {
    auth_scheme = "SECRETS" //todo a chequiar
    description = "example"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.my_secret.arn
  }
}

resource "aws_db_proxy_default_target_group" "my_target_group" {
  db_proxy_name = aws_db_proxy.my_rds_proxy.name

  connection_pool_config {
    connection_borrow_timeout = 120
    # init_query                   = ""
    max_connections_percent      = 100
    max_idle_connections_percent = 50
    # session_pinning_filters      = ["EXCLUDE_VARIABLE_SETS"]
  }
}

resource "aws_db_proxy_target" "example" {
  db_instance_identifier = aws_db_instance.primary_db.identifier
  db_proxy_name          = aws_db_proxy.my_rds_proxy.name
  target_group_name      = aws_db_proxy_default_target_group.my_target_group.name
}



### secret manager

resource "aws_secretsmanager_secret" "my_secret" {
  name = "rds_secret_"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "my_secret_version" {
  secret_id = aws_secretsmanager_secret.my_secret.id

  secret_string = jsonencode({
    username = var.db_user,
    password = var.db_pass
  })
}