locals {
  lab_role       = "arn:aws:iam::${var.account_id}:role/LabRole"
  zip_target_dir = "resources/lambda/target"
  lambda_functions = {
    createBoard = {
      function_name    = "createBoard",
      source_code_file = "resources/lambda/src/createBoard.js",
      handler          = "createBoard.handler",
      runtime          = "nodejs16.x",
    },
    createBugInBoard = {
      function_name    = "createBugInBoard",
      source_code_file = "resources/lambda/src/createBugInBoard.js",
      handler          = "createBugInBoard.handler",
      runtime          = "nodejs16.x",
    },
    getBoardsByUsername = {
      function_name    = "getBoardsByUsername",
      source_code_file = "resources/lambda/src/getBoardsByUsername.js",
      handler          = "getBoardsByUsername.handler",
      runtime          = "nodejs16.x",
    },
    getBugsByBoardId = {
      function_name    = "getBugsByBoardId",
      source_code_file = "resources/lambda/src/getBugsByBoardId.js",
      handler          = "getBugsByBoardId.handler",
      runtime          = "nodejs16.x",
    },
    checkDeadlines = {
      function_name    = "checkDeadlines",
      source_code_file = "resources/lambda/src/checkDeadlines.js",
      handler          = "checkDeadlines.handler",
      runtime          = "nodejs16.x",
    },
  }
}
