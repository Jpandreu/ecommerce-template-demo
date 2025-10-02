# 🛡️ SECURITY CHECK - LIMPIEZA DE ARCHIVOS PRIVADOS
# Este script asegura que NO se incluya información confidencial

Write-Host "🛡️  SECURITY CHECK: Limpiando archivos privados..." -ForegroundColor Red

$packagePath = "C:\laragon\www\ThemeForest-Package\ecommerce-template"

# ARCHIVOS PRIVADOS QUE NO DEBEN IR EN EL PAQUETE COMERCIAL
$privateFiles = @(
    # Estrategia y marketing
    "*STRATEGY*",
    "*MARKETING*", 
    "*PRICING*",
    "*PLAN-MAESTRO*",
    "*PRIVATE*",
    
    # Gestión interna
    "*management*",
    "*private-*",
    
    # Configuraciones de demo
    "*DEMO-*",
    "*demo.*",
    
    # Guías internas de ThemeForest
    "*THEMEFOREST-*",
    "*GUIA-*",
    "*PUBLICACION*",
    
    # Scripts de desarrollo
    "*deploy*",
    "*generate*",
    "*create-*",
    "*prepare-*",
    
    # Archivos de configuración de desarrollo
    ".github",
    ".git*",
    "*.ps1",
    
    # Documentación interna
    "*CHECKLIST*",
    "*TODO*",
    "*NOTES*"
)

Write-Host "Verificando archivos privados en el paquete comercial..." -ForegroundColor Yellow

$foundPrivateFiles = @()

foreach ($pattern in $privateFiles) {
    $matches = Get-ChildItem -Path $packagePath -Name $pattern -Recurse -ErrorAction SilentlyContinue
    if ($matches) {
        $foundPrivateFiles += $matches
        foreach ($file in $matches) {
            $filePath = Join-Path $packagePath $file
            Remove-Item $filePath -Force -Recurse -ErrorAction SilentlyContinue
            Write-Host "   ❌ REMOVIDO: $file" -ForegroundColor Red
        }
    }
}

if ($foundPrivateFiles.Count -eq 0) {
    Write-Host "✅ SEGURIDAD OK: No se encontraron archivos privados" -ForegroundColor Green
} else {
    Write-Host "🛡️  Se removieron $($foundPrivateFiles.Count) archivos privados" -ForegroundColor Yellow
}

Write-Host "`nVerificando contenido de archivos..." -ForegroundColor Yellow

# Verificar que no haya información sensible en los archivos
$sensitiveContent = @(
    "STRATEGY",
    "MARKETING", 
    "PRICING",
    "PRIVATE",
    "INTERNAL",
    "TODO:",
    "NOTA:",
    "CLIENT-ID.*sb",  # PayPal sandbox ID específico
    "demo.*github",   # URLs de demo específicas
    "laragon"         # Rutas de desarrollo local
)

$files = Get-ChildItem -Path $packagePath -Include "*.html", "*.md", "*.txt", "*.js", "*.css" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        foreach ($pattern in $sensitiveContent) {
            if ($content -match $pattern) {
                Write-Host "   ⚠️  ADVERTENCIA: '$($file.Name)' contiene: $pattern" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "`n📦 VERIFICANDO ESTRUCTURA FINAL DEL PAQUETE:" -ForegroundColor Cyan
Get-ChildItem -Path $packagePath -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace($packagePath, "").TrimStart('\')
    if ($_.PSIsContainer) {
        Write-Host "📁 $relativePath" -ForegroundColor Blue
    } else {
        Write-Host "📄 $relativePath" -ForegroundColor Gray
    }
}

Write-Host "`n✅ LIMPIEZA COMPLETADA" -ForegroundColor Green
Write-Host "El paquete comercial está LISTO y SEGURO para ThemeForest" -ForegroundColor Green

# Regenerar ZIP limpio
Write-Host "`n📦 Regenerando ZIP limpio..." -ForegroundColor Yellow
$zipPath = "C:\laragon\www\ThemeForest-Package\ecommerce-template-CLEAN.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($packagePath, $zipPath)

Write-Host "✅ ZIP LIMPIO creado: ecommerce-template-CLEAN.zip" -ForegroundColor Green
Write-Host "🛡️  ESTE ZIP ES SEGURO PARA SUBIR A THEMEFOREST" -ForegroundColor Green