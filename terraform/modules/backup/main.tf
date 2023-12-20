resource "aws_backup_vault" "my-backup-vault" {
  name = "my-backup-vault"
}

resource "aws_backup_plan" "rds_backup_plan" {
  name = "rds-backup-plan"

  rule {
    rule_name                = "rds-instance-daily-backup-rule"
    target_vault_name        = aws_backup_vault.my-backup-vault.name
    schedule                 = "cron(0 12 * * ? *)"
    enable_continuous_backup = true

    lifecycle {
      delete_after = 14 # 14 day retention policy
    }
  }
}

resource "aws_backup_selection" "rds_instance_selection" {
  iam_role_arn = local.lab_role
  name         = "rds-backup-selection"
  plan_id      = aws_backup_plan.rds_backup_plan.id

  resources = [
    var.primary_db_arn
  ]
}