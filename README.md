# Cloud Computing - 2023Q2-G4 

El siguiente repositorio contiene el código Terraform para la tercera entrega del TP3 del Grupo 4. 

## Módulos implementados 

- Módulos propios:
1. VPC y Subnets: 
2. Lambdas: 
3. API Gateway: 
4. Eventbridge (Scheduler): 
5. S3 para front-end: 
6. Route53 + Cloudfront: 
7. RDS

- Módulos externos:


## Componentes
1. VPC
2. Lambda
3. API Gateway
4. Eventbridge
5. S3 
6. Cloudfront

## Funciones
1. format: 
    - ubicación: lambda/main.tf ; data "archive_file" "lambda_zips"
        - descripción: Se genera un output path sustituyendo dos placeholders, uno con el directorio objetivo y el otro con el nombre de la función de lambda.
    - ubicación: lambda/main.tf ; resource "aws_s3_object" "lambda_objects"
        - descripción: 
2. filemd5:
    - ubicación: lambda/main.tf ; resource "aws_s3_object" "lambda_objects"
        - descripción: Se hashea el archivo referido a la funcion de lambda.
    - ubicación: S3/main.tf ; resource "aws_s3_object" "data"
        - descripción: 
3. length:
    - ubicación: vpc/main.tf ; resource "aws_subnet" "private_subnets"
        - descripción: 
4. cidrsubnet:
    - ubicación: vpc/main.tf ; resource "aws_subnet" "private_subnets"
        - descripción: 

## Meta-argumentos
1. depends_on:
    - ubicación: route53/main.tf ; resource "aws_route53_record" "www"
        - dependencia: aws_route53_record.domain_record
        - descripción: Garantiza que el registro DNS del subdominio "www" se cree después de que se cree el registro DNS del dominio principal (el "registro_dominio"). Esto se debe a que el registro de subdominio "www" se refiere al dominio principal, por lo que es importante que el registro de dominio principal exista antes de crear el registro de subdominio "www".
    - ubicación: route53/main.tf ; resource "aws_route53_record" "certs_records"
        - dependencia: 
        - descripción: 
    - ubicación: route53/main.tf ; resource "aws_acm_certificate_validation" "cert_validation"
        - dependencia: 
        - descripción: 

2. for_each:
    - ubicación: api_gw/main.tf ; resource "aws_lambda_permission" "apigw"
        - descripción: 
    - ubicación: lambda/main.tf ; data "archive_file" "lambda_zips"
        - descripción: 
    - ubicación: lambda/main.tf ; resource "aws_s3_object" "lambda_objects"
        - descripción: 
    - ubicación: lambda/main.tf ; resource "aws_lambda_function" "lambda_functions"
        - descripción: 
    - ubicación: route53/main.tf ; resource "aws_route53_record" "certs_records"
        - descripción: 
    - ubicación: S3/main.tf ; resource "aws_s3_object" "data"
        - descripción: 

3. count:

4. lifecycle:

## Componentes a corregir

La consigna original del trabajo práctico pedía implementar exactamente 6 módulos. Los módulos que marcamos con un * en el listado anterior son los que entregamos para corregir. 