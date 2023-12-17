resource "aws_sns_topic" "bug_topic" {
  name = "newbug"

}

resource "aws_sns_topic_policy" "bug_topic_policy" {
  arn = aws_sns_topic.bug_topic.arn
  policy = jsonencode({
    "Version" : "2008-10-17",
    "Id" : "__default_policy_ID",
    "Statement" : [
      {
        "Sid" : "__default_statement_ID",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : "*"
        },
        "Action" : [
          "SNS:Publish",
          "SNS:RemovePermission",
          "SNS:SetTopicAttributes",
          "SNS:DeleteTopic",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes",
          "SNS:AddPermission",
          "SNS:Subscribe"
        ],
        "Resource" : "${aws_sns_topic.bug_topic.arn}",
        "Condition" : {
          "StringEquals" : {
            "AWS:SourceOwner" : "${var.account_id}"
          }
        }
      },
      {
        "Sid" : "__console_pub_0",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : "*"
        },
        "Action" : "SNS:Publish",
        "Resource" : "${aws_sns_topic.bug_topic.arn}"
      },
      {
        "Sid" : "__console_sub_0",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : "*"
        },
        "Action" : "SNS:Subscribe",
        "Resource" : "${aws_sns_topic.bug_topic.arn}"
      }
    ]
  })
}

resource "aws_security_group" "sns_endpoint_sg" {
  name_prefix = "sns-endpoint-sg"
  vpc_id      = var.vpc_info.vpc_id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [var.lambda_sg_id]
  }
}

resource "aws_vpc_endpoint" "sns_endpoint" {
  vpc_id             = var.vpc_info.vpc_id
  vpc_endpoint_type = "Interface"
  service_name       = "com.amazonaws.us-east-1.sns"
  security_group_ids = [aws_security_group.sns_endpoint_sg.id]
  subnet_ids = var.subnet_ids
  private_dns_enabled = true
}