# resource "aws_db_instance" "default" {
#   allocated_storage    = 10
#   db_name              = var.db_name
#   engine               = "mysql"
#   engine_version       = "5.7"
#   instance_class       = "db.t3.micro"
#   username             = var.db_user
#   password             = var.db_pass
#   parameter_group_name = "default.mysql5.7"
#   skip_final_snapshot  = true
# }

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

  username = var.db_user
  password = var.db_pass

  db_subnet_group_name   = aws_db_subnet_group.database.id
  parameter_group_name   = aws_db_parameter_group.database.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Backups are required in order to create a replica
  # maintenance_window      = "Mon:00:00-Mon:03:00"
  # backup_window           = "03:00-06:00"
  # backup_retention_period = 5

  storage_encrypted               = false //todo make true
  # kms_key_id                      = aws_kms_key.db.arn
  # performance_insights_enabled    = true
  # performance_insights_kms_key_id = aws_kms_key.db.arn

  skip_final_snapshot = true
  # apply_immediately   = true
}

