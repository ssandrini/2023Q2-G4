resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "main_vpc"
  }
}

resource "aws_subnet" "private_subnets" {
  count = length(var.subnet_configs)

  cidr_block              = cidrsubnet(var.base_cidr_block, var.subnet_configs[count.index].subnet_bits, count.index + 1)
  availability_zone       = var.subnet_configs[count.index].availability_zone
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true # y esto?

  tags = {
    Name        = var.subnet_configs[count.index].name
    Environment = "Development"
  }
}

#resource "aws_internet_gateway" "gw" {
#  vpc_id = aws_vpc.main.id
#
#  tags = {
#    Name = "igw-main"
#  }
#}

#resource "aws_route_table" "custom_route_table" {
#  vpc_id = aws_vpc.main.id
#}

#resource "aws_route" "subnet_routes" {
#  route_table_id         = aws_route_table.custom_route_table.id
#  destination_cidr_block = "0.0.0.0/0"
#  gateway_id             = aws_internet_gateway.gw.id
#}

#resource "aws_route_table_association" "subnet_associations" {
#  count = length(aws_subnet.public_subnets)
#
#  subnet_id      = aws_subnet.public_subnets[count.index].id
#  route_table_id = aws_route_table.custom_route_table.id
#  depends_on = [aws_route.subnet_routes]
#}