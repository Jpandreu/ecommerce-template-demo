$filePath = "products.html"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Reemplazos principales
$content = $content -replace "Vista Rápida", "Quick View"
$content = $content -replace "Añadir al Carrito", "Add to Cart"
$content = $content -replace "reseñas", "reviews"
$content = $content -replace "Carrito", "Cart"

# Guardar el archivo
Set-Content $filePath $content -NoNewline -Encoding UTF8

Write-Host "Traducción completada exitosamente"
