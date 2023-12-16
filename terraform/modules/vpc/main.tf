resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "main_vpc"
  }
}

resource "aws_vpc_endpoint" "sns_endpoint" {
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.us-east-1.sns"
}

resource "aws_subnet" "private_subnets" {
  count = length(var.subnet_configs)

  cidr_block        = cidrsubnet(var.base_cidr_block, var.subnet_configs[count.index].subnet_bits, count.index + 1)
  availability_zone = var.subnet_configs[count.index].availability_zone
  vpc_id            = aws_vpc.main.id

  tags = {
    Name        = var.subnet_configs[count.index].name
    Environment = "Development"
  }
}