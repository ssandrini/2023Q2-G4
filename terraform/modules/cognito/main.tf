resource "aws_cognito_user_pool" "main_user_pool" {
  name = "main_user_pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Account Confirmation"
    email_message        = "Your confirmation code is {####}"
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
  }

  mfa_configuration = "OFF"
}

resource "aws_cognito_user_pool_domain" "cognito_domain" {
  domain       = "boogieboardv321321" // TODO: cambienlo
  user_pool_id = aws_cognito_user_pool.main_user_pool.id
}

resource "aws_cognito_user_pool_client" "userpool_client" {
  name                                 = "client"
  user_pool_id                         = aws_cognito_user_pool.main_user_pool.id

  callback_urls                        = ["https://holamundo.com"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
}