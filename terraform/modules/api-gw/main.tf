resource "aws_api_gateway_rest_api" "main_api_gw" {
  name = "main"
}

// Define endpoints 

resource "aws_api_gateway_resource" "boards_resource" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  parent_id   = aws_api_gateway_rest_api.main_api_gw.root_resource_id
  path_part   = "boards"
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

// Define methods 

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

// Define integrations 

resource "aws_api_gateway_integration" "boards_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.boards_resource.id
  http_method             = aws_api_gateway_method.boards_method_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["getBoardsByUsername"]
}

resource "aws_api_gateway_integration" "boards_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.boards_resource.id
  http_method             = aws_api_gateway_method.boards_method_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["createBoard"]
}

resource "aws_api_gateway_integration" "bugs_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.bugs_resource.id
  http_method             = aws_api_gateway_method.bugs_method_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["getBugsByBoardId"]
}

resource "aws_api_gateway_integration" "bugs_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.main_api_gw.id
  resource_id             = aws_api_gateway_resource.bugs_resource.id
  http_method             = aws_api_gateway_method.bugs_method_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns["createBugInBoard"]
}

// Define Lambda permissions 

resource "aws_lambda_permission" "apigw" {
  for_each      = var.lambda_arns
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = each.key // "${aws_lambda_function.example.function_name}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.main_api_gw.execution_arn}/*/*"
}

// Define API GW Deployment
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.main_api_gw.id
  stage_name  = "dev"
}
