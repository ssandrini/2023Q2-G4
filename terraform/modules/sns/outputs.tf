output "sns_topic_arn" {
  value = aws_sns_topic.bug_topic.arn
}

output "sns_endpoint_sg_id" {
  value = aws_security_group.sns_endpoint_sg.id
}