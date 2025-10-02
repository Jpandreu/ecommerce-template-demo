# SECURITY CHECK - Limpieza de archivos privados
Write-Host "Verificando seguridad del paquete comercial..." -ForegroundColor Red

$packagePath = "C:\laragon\www\ThemeForest-Package\ecommerce-template"

# Archivos privados que NO deben estar en el paquete
$privatePatterns = @(
    "*STRATEGY*",
    "*MARKETING*", 
    "*PRICING*",
    "*PLAN-MAESTRO*",
    "*PRIVATE*",
    "*management*",
    "*DEMO-*",
    "*THEMEFOREST-*",
    "*GUIA-*",
    "*deploy*",
    "*create-*",
    "*prepare-*",
    "*.ps1"
)

Write-Host "Limpiando archivos privados..." -ForegroundColor Yellow

$removed = 0
foreach ($pattern in $privatePatterns) {
    $files = Get-ChildItem -Path $packagePath -Name $pattern -Recurse -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $fullPath = Join-Path $packagePath $file
        Remove-Item $fullPath -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "   Removido: $file" -ForegroundColor Red
        $removed++
    }
}

if ($removed -eq 0) {
    Write-Host "OK: No se encontraron archivos privados" -ForegroundColor Green
} else {
    Write-Host "Se removieron $removed archivos privados" -ForegroundColor Yellow
}

Write-Host "`nEstructura final del paquete:" -ForegroundColor Cyan
Get-ChildItem -Path $packagePath -Recurse | ForEach-Object {
    $name = $_.Name
    if ($_.PSIsContainer) {
        Write-Host "  [DIR]  $name" -ForegroundColor Blue
    } else {
        Write-Host "  [FILE] $name" -ForegroundColor Gray
    }
}

# Crear ZIP limpio
Write-Host "`nCreando ZIP limpio..." -ForegroundColor Yellow
$zipPath = "C:\laragon\www\ThemeForest-Package\ecommerce-template-SECURE.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($packagePath, $zipPath)

Write-Host "ZIP SEGURO creado: ecommerce-template-SECURE.zip" -ForegroundColor Green
Write-Host "ESTE ZIP ES SEGURO PARA THEMEFOREST" -ForegroundColor Green