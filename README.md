# Cloud Computing - 2023Q2-G4 

El siguiente repositorio contiene el código Terraform para la tercera entrega del TP3 del Grupo 4. 

### Correr el proyecto 
Nótese que hay un proyecto de Terraform secundario llamado terraform-hz, el cual se encarga únicamente de levantar una hosted zone.  Para poder correr correctamente el proyecto se debe: 
1. Correr primero el proyecto  `terraform-hz`. El mismo levanta una hosted zone y la popula con registros NS populados al azar por AWS.
2. Comunicarse via email con los estudiantes para que vinculen los registros NS proporcionados por AWS en `nic.ar`. Los mismos pueden ser consultados en el output del proyecto. 
3. Una vez recibida confirmación por parte del grupo, se puede continuar levantando la arquitectura principal corriendo `terraform apply` dentro de la carpeta `terraform/organization`

## Módulos implementados 

1. vpc: 
    Creación de la VPC con el rango de direcciones IP definido por el CIDR, creación de las subredes privadas, también con los rangos de direcciones pertinentes.
2. lambda: 
    Implementación de las funciones Lambda. Se crea un bucket de S3 con un nombre aleatorio generado con random_pet, con el objetivo de asegurar un nombre único, donde se almacenará el código fuente de las funciones. Se bloquea el acceso público al bucket valiéndose del recurso 'aws_s3_bucket_public_access_block' y se crea un grupo de seguridad dentro de la VPC para controlar el tráfico.
3. api-gw: 
    Configuración de infraestructura para la API Rest, se generan los endpoints para los boards y los bugs, sus respectivos métodos y se integra las funciones Lambda que permiten utilizarlos. 
4. eventbridge: 
    Se encarga de ejecutar la función Lambda de checkDeadlines tras intervalos regulares, utilizando el criterio de dos veces al día.
5. S3: 
    Importación desde "terraform-aws-modules/s3-bucket/aws" de 3 módulos externos para alojar el front-end: frontend_bucket, logs_bucket y redirect_bucket. En estos se almacerán los archivos estáticos de la web, se registrarán los accesos a la misma y se redirigirán las solicitudes al dominio correspondiente, respectivamente.
6. cloudfront:
    Se establece una distribución de cloudfront para servir el contenido del front-end a los usuarios finales. Se definen las políticas de acceso a los buckets de S3 y se utiliza un recurso de identidad de acceso al origen para poder acceder a los buckets S3.
7. route53: 
    Crea los registros tipo A y CNAME para acceder al sitio web estático a través de cloudfront.

8. acm:
    Se crea el certficado SSL del dominio y se generan los registros DNS para la validar que el dominio nos pertenece y así poder generar el certificado.

## Componentes a corregir
1. Networking (VPC + Subnets)
2. Lambda 
3. API Gateway
4. S3 (front-end)
5. Cloudfront
6. Eventbridge (Scheduler)

## Extras
7. Routing (Route53 + ACM)

## Funciones
1. format: 
    Se utiliza en el módulo de lambda para definir el nombre del archivo que almacenará cada lambda, manteniendo una parte fija y reemplazando el placeholder por el nombre de cada función lambda.

2. filemd5:
    En el módulo lambda se emplea para generar el hash del codigo fuente de las lambdas, con el objetivo de verificar el cambio de contenido de los mismos.

3. length:
    Se utiliza en el módulo de vpc con la finalidad de realizar un indexado de las subredes.

4. cidrsubnet:
    En el módulo vpc nos permite calcular los bloques de direcciones CIDR para las subredes privadas.

## Meta-argumentos
1. depends_on:
    Se utliza al crear los módulos, para asegurar que antes de crear el módulo cloudfront se cree el módulo ACM ya que cloudfront necesita del certificado. Además, una vez levantado cloudfront, es posible agregar los registros creados en el módulo route 53.

2. for_each:
    En el módulo de lambda se utiliza para iterar por cada función en la generación y referencia de archivos .zip.
    En el caso del módulo de api gateway, también se itera por cada lambda generando las autorizaciones necesarias para que la api gateway pueda invocar las funciones.
    Para el módulo de acm, for_each nos permite la creación de registros DNS en función de cada opción de validación de dominio de un certificado.
    Por último, en el módulo de S3 se utliza para la creación de los objetos necesarios para levantar el sitio web estático (js, html y css).

3. lifecycle: 
    Se utiliza en el modulo de ACM, seteando como verdadero el argumento de "create_before_destroy", con el objetivo de asegurar que la renovación de los certificados SSL/TLS se realice de manera fluida, es decir, creando el nuevo certificado antes de eliminar el actual.

4. count:
    En el módulo VPC se utiliza para iterar en la definición de las subredes y crearlas con un mismo recurso.

# Diagrama

Diagrama entregado en el TP2 pero solamente mostrando los componentes y conexiones implementados:

![Diagrama entregado en el TP2 pero solamente mostrando los componentes y conexiones implementados](diagrama.png)

# Integrantes

- Gonzalo Manuel Beade   (61223)   25%

- Lucas Arbués           (61890)   25%

- Santiago Sandrini      (61447)   25%

- Uriel Mihura           (59039)   25%

