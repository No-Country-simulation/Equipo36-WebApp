# ========================================
# Script PowerShell - Levantar VitalMedic
# ========================================

Write-Host "🐳 VitalMedic - Docker Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Verificar Docker
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
$dockerVersion = docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "   Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}
Write-Host "✅ $dockerVersion" -ForegroundColor Green

# Verificar Docker Compose
$composeVersion = docker-compose --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Compose no está instalado" -ForegroundColor Red
    exit 1
}
Write-Host "✅ $composeVersion`n" -ForegroundColor Green

# Navegar a la raíz del proyecto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Opciones
Write-Host "Opciones:" -ForegroundColor Cyan
Write-Host "1. 🚀 Levantar TODO (PostgreSQL + Backend + Frontend)" -ForegroundColor White
Write-Host "2. 🔧 Levantar solo Backend + PostgreSQL" -ForegroundColor White
Write-Host "3. 🗄️  Levantar solo PostgreSQL" -ForegroundColor White
Write-Host "4. 🔄 Reiniciar servicios" -ForegroundColor White
Write-Host "5. 🛑 Detener servicios" -ForegroundColor White
Write-Host "6. 🧹 Limpiar TODO (elimina datos)" -ForegroundColor White
Write-Host "7. 📊 Ver logs" -ForegroundColor White
Write-Host "8. ❌ Salir`n" -ForegroundColor White

$opcion = Read-Host "Selecciona una opción (1-8)"

switch ($opcion) {
    "1" {
        Write-Host "`n🚀 Levantando TODO el sistema..." -ForegroundColor Green
        Write-Host "   Esto puede tomar 2-3 minutos la primera vez...`n" -ForegroundColor Yellow
        docker-compose up -d --build
        
        Write-Host "`n⏳ Esperando que los servicios estén listos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host "`n✅ Sistema levantado!" -ForegroundColor Green
        Write-Host "`n📍 URLs disponibles:" -ForegroundColor Cyan
        Write-Host "   🎨 Frontend:  http://localhost:5173" -ForegroundColor White
        Write-Host "   🔧 Backend:   http://localhost:8080/api" -ForegroundColor White
        Write-Host "   📚 Swagger:   http://localhost:8080/swagger-ui.html" -ForegroundColor White
        Write-Host "   🗄️  PostgreSQL: localhost:5433" -ForegroundColor White
        
        Write-Host "`n💡 Ver logs: docker-compose logs -f" -ForegroundColor Yellow
        Write-Host "💡 Detener: docker-compose down`n" -ForegroundColor Yellow
        
        # Abrir navegador
        Start-Sleep -Seconds 5
        Start-Process "http://localhost:5173"
    }
    
    "2" {
        Write-Host "`n🔧 Levantando Backend + PostgreSQL..." -ForegroundColor Green
        docker-compose up -d --build postgres backend
        
        Write-Host "`n✅ Backend y PostgreSQL levantados!" -ForegroundColor Green
        Write-Host "`n📍 URLs disponibles:" -ForegroundColor Cyan
        Write-Host "   🔧 Backend:   http://localhost:8080/api" -ForegroundColor White
        Write-Host "   📚 Swagger:   http://localhost:8080/swagger-ui.html" -ForegroundColor White
        Write-Host "   🗄️  PostgreSQL: localhost:5433`n" -ForegroundColor White
    }
    
    "3" {
        Write-Host "`n🗄️  Levantando solo PostgreSQL..." -ForegroundColor Green
        docker-compose up -d postgres
        
        Write-Host "`n✅ PostgreSQL levantado!" -ForegroundColor Green
        Write-Host "`n📍 Conexión:" -ForegroundColor Cyan
        Write-Host "   Host: localhost" -ForegroundColor White
        Write-Host "   Port: 5433" -ForegroundColor White
        Write-Host "   Database: vitalmedic_local" -ForegroundColor White
        Write-Host "   Username: vitalmedic_user" -ForegroundColor White
        Write-Host "   Password: [Ver archivo .env]`n" -ForegroundColor White
    }
    
    "4" {
        Write-Host "`n🔄 Reiniciando servicios..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "✅ Servicios reiniciados!`n" -ForegroundColor Green
    }
    
    "5" {
        Write-Host "`n🛑 Deteniendo servicios..." -ForegroundColor Yellow
        docker-compose stop
        Write-Host "✅ Servicios detenidos!`n" -ForegroundColor Green
    }
    
    "6" {
        Write-Host "`n⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos local" -ForegroundColor Red
        $confirmacion = Read-Host "¿Estás seguro? (si/no)"
        
        if ($confirmacion -eq "si") {
            Write-Host "`n🧹 Limpiando TODO..." -ForegroundColor Yellow
            docker-compose down -v --rmi local
            Write-Host "✅ Sistema limpiado completamente!`n" -ForegroundColor Green
        } else {
            Write-Host "❌ Operación cancelada`n" -ForegroundColor Yellow
        }
    }
    
    "7" {
        Write-Host "`n📊 Mostrando logs (Ctrl+C para salir)...`n" -ForegroundColor Cyan
        docker-compose logs -f
    }
    
    "8" {
        Write-Host "`n👋 ¡Hasta luego!`n" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host "`n❌ Opción inválida`n" -ForegroundColor Red
        exit 1
    }
}
