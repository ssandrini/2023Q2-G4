locals {
  lab_role       = "arn:aws:iam::${var.account_id}:role/LabRole"
  zip_target_dir = "../resources/lambda/target"
  lambda_functions = {
    createBoard = {
      function_name    = "createBoard",
      source_code_file = "../resources/lambda/src/createBoard.js",
      handler          = "createBoard.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
        SNS_HOST    = var.sns_topic_arn
      }
    },
    createBugInBoard = {
      function_name    = "createBugInBoard",
      source_code_file = "../resources/lambda/src/createBugInBoard.js",
      handler          = "createBugInBoard.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
        SNS_HOST    = var.sns_topic_arn
      }
    },
    getBoardsByUsername = {
      function_name    = "getBoardsByUsername",
      source_code_file = "../resources/lambda/src/getBoardsByUsername.js",
      handler          = "getBoardsByUsername.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
      }
    },
    getBugsByBoardId = {
      function_name    = "getBugsByBoardId",
      source_code_file = "../resources/lambda/src/getBugsByBoardId.js",
      handler          = "getBugsByBoardId.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
      }
    },
    checkDeadlines = {
      function_name    = "checkDeadlines",
      source_code_file = "../resources/lambda/src/checkDeadlines.js",
      handler          = "checkDeadlines.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
        SNS_HOST    = var.sns_topic_arn
      }
    },
    createTables = {
      function_name    = "createTables",
      source_code_file = "../resources/lambda/src/createTables.js",
      handler          = "createTables.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
      }
    },
    createUser = {
      function_name    = "createUser",
      source_code_file = "../resources/lambda/src/createUser.js",
      handler          = "createUser.handler",
      runtime          = "nodejs18.x",
      variables = {
        DB_USER     = var.db_user
        DB_PASSWORD = var.db_pass
        DB_HOST     = var.proxy_arn
        DB_NAME     = var.db_name
      }
    },
    # updateBug = {
    #   function_name    = "updateBug",
    #   source_code_file = "../resources/lambda/src/updateBug.js",
    #   handler          = "updateBug.handler",
    #   runtime          = "nodejs18.x",
    #   variables = {
    #     DB_USER     = var.db_user
    #     DB_PASSWORD = var.db_pass
    #     DB_HOST     = var.proxy_arn
    #     DB_NAME     = var.db_name
    #     SNS_HOST    = var.sns_topic_arn
    #   }
    # },
  }
}
