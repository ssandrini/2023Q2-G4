resource "aws_sns_topic" "bug_topic" {
    name = "newbug"
    
}

resource "aws_sns_topic_policy" "bug_topic_policy" {
    arn = aws_sns_topic.bug_topic.arn
    policy = jsonencode({
        "Version": "2008-10-17",
        "Id": "__default_policy_ID",
        "Statement": [
            {
            "Sid": "__default_statement_ID",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": [
                "SNS:Publish",
                "SNS:RemovePermission",
                "SNS:SetTopicAttributes",
                "SNS:DeleteTopic",
                "SNS:ListSubscriptionsByTopic",
                "SNS:GetTopicAttributes",
                "SNS:AddPermission",
                "SNS:Subscribe"
            ],
            "Resource": "${aws_sns_topic.bug_topic.arn}",
            "Condition": {
                "StringEquals": {
                "AWS:SourceOwner": "${var.account_id}"
                }
            }
            },
            {
            "Sid": "__console_pub_0",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "SNS:Publish",
            "Resource": "${aws_sns_topic.bug_topic.arn}"
            },
            {
            "Sid": "__console_sub_0",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "SNS:Subscribe",
            "Resource": "${aws_sns_topic.bug_topic.arn}"
            }
        ]
        })
}