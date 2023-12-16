resource "aws_security_group" "rds" {
  name   = "terraform_rds_security_group"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 0
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }
}

#esto estaba cuando setupeamos la lambda que le pegue al RDS proxy a mano:
# ~ resource "aws_security_group" "rds" {
#       ~ egress                 = [
#           - {
#               - cidr_blocks      = [
#                   - "10.0.0.0/16",
#                 ]
#               - description      = ""
#               - from_port        = 0
#               - ipv6_cidr_blocks = []
#               - prefix_list_ids  = []
#               - protocol         = "-1"
#               - security_groups  = []
#               - self             = false
#               - to_port          = 0
#             },
#           - {
#               - cidr_blocks      = []
#               - description      = "Rule to allow connections from create-rds-table Lambda function to my-rds-proxy RDS Proxy"
#               - from_port        = 5432
#               - ipv6_cidr_blocks = []
#               - prefix_list_ids  = []
#               - protocol         = "tcp"
#               - security_groups  = [
#                   - "sg-02fdfae50c677751c",
#                 ]
#               - self             = false
#               - to_port          = 5432
#             },