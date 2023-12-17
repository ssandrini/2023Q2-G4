resource "aws_sns_topic" "new_bug" {
  name = "new-bug"
}

resource "aws_vpc_endpoint" "sns_endpoint" {
  vpc_id = var.vpc_info.vpc_id
  service_name = "com.amazonaws.us-east-1.sns"
  vpc_endpoint_type = "Interface"
}