resource "aws_api_gateway_rest_api" "main_api_gw" {
  name = "main"
}


// Define Cognito authorizer 

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name                   = "cognito-authorizer"
  rest_api_id            = aws_api_gateway_rest_api.main_api_gw.id
  type                   = "COGNITO_USER_POOLS"
  identity_source        = "method.request.header.Authorization"
  authorizer_uri         = var.user_pool_arn
  authorizer_credentials = local.lab_role
  provider_arns = [var.user_pool_arn]
}

// Define endpoints 

resource "aws_api_gateway_resource" "boards_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_rest_api.main_api_gw.root_resource_id
  path_part   = "boards"
  depends_on  = [aws_api_gateway_rest_api.main_api_gw]
}

resource "aws_api_gateway_resource" "boardid_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_resource.boards_resource.id
  path_part   = "{boardId}"
}

resource "aws_api_gateway_resource" "bugs_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_resource.boardid_resource.id
  path_part   = "bugs"
}

resource "aws_api_gateway_resource" "bugid_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_resource.bugs_resource.id
  path_part   = "{bugId}"
}

resource "aws_api_gateway_resource" "users_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_rest_api.main_api_gw.root_resource_id
  path_part   = "users"
  depends_on  = [aws_api_gateway_rest_api.main_api_gw]
}

resource "aws_api_gateway_resource" "userid_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_resource.users_resource.id
  path_part   = "{userId}"
}

resource "aws_api_gateway_method" "boards_method_get" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.boards_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "boards_method_post" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.boards_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "boards_method_patch" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.boardid_resource.id
  http_method   = "PATCH"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "bugs_method_get" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.bugs_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "bugs_method_post" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.bugs_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "bugs_method_patch" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.bugid_resource.id
  http_method   = "PATCH"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "users_method_post" {
  rest_api_id   = aws_api_gateway_rest_api.main_api_gw.id
  resource_id   = aws_api_gateway_resource.users_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "boards_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.boards_resource.id
  http_method             = aws_api_gateway_method.boards_method_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["getBoardsByUsername"]
  depends_on              = [aws_api_gateway_method.boards_method_get]
}

resource "aws_api_gateway_integration" "boards_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.boards_resource.id
  http_method             = aws_api_gateway_method.boards_method_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["createBoard"]
  depends_on              = [aws_api_gateway_method.boards_method_post]
}

resource "aws_api_gateway_integration" "boards_patch_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.boardid_resource.id
  http_method             = aws_api_gateway_method.boards_mesthod_patch.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["addUserToBoard"]
  depends_on              = [aws_api_gateway_method.boards_method_patch]
}

resource "aws_api_gateway_integration" "bugs_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.bugs_resource.id
  http_method             = aws_api_gateway_method.bugs_method_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["getBugsByBoardId"]
  depends_on              = [aws_api_gateway_method.bugs_method_get]
}

resource "aws_api_gateway_integration" "bugs_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.bugs_resource.id
  http_method             = aws_api_gateway_method.bugs_method_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["createBugInBoard"]
  depends_on              = [aws_api_gateway_method.bugs_method_post]
}

resource "aws_api_gateway_integration" "bugs_patch_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.bugid_resource.id
  http_method             = aws_api_gateway_method.bugs_method_patch.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["updateBug"]
  depends_on              = [aws_api_gateway_method.bugs_method_patch]
}

resource "aws_api_gateway_integration" "users_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.users_resource.id
  http_method             = aws_api_gateway_method.users_method_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["createUser"]
  depends_on              = [aws_api_gateway_method.users_method_post]
}

resource "aws_lambda_permission" "apigw" {
  for_each      = var.lambda_arns
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = each.key
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main_api_gw.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  stage_name  = "dev"
  depends_on = [aws_api_gateway_integration.boards_get_integration,
    aws_api_gateway_integration.boards_post_integration,
    aws_api_gateway_integration.bugs_get_integration,
    aws_api_gateway_integration.bugs_post_integration,
  ]
}
