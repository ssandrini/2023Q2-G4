output "name_servers" {
    value = aws_route53_zone.primary.name_servers
}

output "explanation" {
    value = "[IMPORTANTE] Por favor, contactarse con el grupo via mail para poder subir estos name servers a Nic y poder probar todo el proyecto."
}