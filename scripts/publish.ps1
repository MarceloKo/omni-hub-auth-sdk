# Script de publicação para Windows (PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType
)

# Função para imprimir mensagens coloridas
function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Color = "Green"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Write-InfoMessage {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Blue
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

# Função para executar comandos
function Invoke-Command {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-ColorMessage "🔄 $Description"
    Write-InfoMessage "Executando: $Command"
    
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "Comando falhou com código de saída: $LASTEXITCODE"
        }
        Write-ColorMessage "✅ $Description - Sucesso"
    }
    catch {
        Write-ErrorMessage "❌ $Description - Falhou"
        Write-ErrorMessage $_.Exception.Message
        exit 1
    }
}

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-ErrorMessage "❌ package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
}

Write-ColorMessage "🚀 Iniciando processo de publicação..."

# Verificar se git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-ErrorMessage "❌ Git não está instalado"
    exit 1
}

# Verificar se npm está instalado
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-ErrorMessage "❌ NPM não está instalado"
    exit 1
}

# Verificar se há mudanças não commitadas
Write-InfoMessage "🔍 Verificando mudanças não commitadas..."
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-ErrorMessage "❌ Existem mudanças não commitadas. Faça commit antes de publicar."
    git status
    exit 1
}

# Verificar se está na branch main/master
Write-InfoMessage "🔍 Verificando branch atual..."
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-ErrorMessage "❌ Você está na branch `"$currentBranch`". Publique apenas da branch main/master."
    exit 1
}

# Verificar se está logado no npm
Write-InfoMessage "🔍 Verificando login no npm..."
try {
    npm whoami | Out-Null
}
catch {
    Write-ErrorMessage "❌ Você não está logado no npm. Execute 'npm login' primeiro."
    exit 1
}

# Obter versão atual
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version
Write-InfoMessage "📋 Versão atual: $currentVersion"

# Atualizar versão
Write-ColorMessage "🔄 Atualizando versão..."
Invoke-Command "npm version $VersionType --no-git-tag-version" "Atualizando versão"

# Obter nova versão
$newPackageJson = Get-Content "package.json" | ConvertFrom-Json
$newVersion = $newPackageJson.version
Write-InfoMessage "📋 Nova versão: $newVersion"

# Executar verificações
Write-ColorMessage "🧪 Executando verificações..."
Invoke-Command "npm run type-check" "Verificação de tipos"
Invoke-Command "npm run lint:check" "Verificação de lint"

# Build
Write-ColorMessage "🔨 Fazendo build..."
Invoke-Command "npm run build" "Build do projeto"

# Commit das mudanças
Write-ColorMessage "💾 Fazendo commit das mudanças..."
Invoke-Command "git add ." "Adicionando arquivos"
Invoke-Command "git commit -m `"chore: bump version to $newVersion`"" "Commit das mudanças"

# Criar tag
Write-ColorMessage "🏷️ Criando tag..."
Invoke-Command "git tag v$newVersion" "Criando tag"

# Push das mudanças e tag
Write-ColorMessage "📤 Fazendo push das mudanças..."
Invoke-Command "git push origin $currentBranch" "Push das mudanças"
Invoke-Command "git push origin v$newVersion" "Push da tag"

# Publicar no npm
Write-ColorMessage "📦 Publicando no npm..."
Invoke-Command "npm publish" "Publicação no npm"

# Sucesso
Write-ColorMessage "🎉 Publicação concluída com sucesso!"
Write-ColorMessage "📦 Versão $newVersion publicada no npm"

# Obter nome do pacote
$packageName = $packageJson.name
Write-ColorMessage "🔗 https://www.npmjs.com/package/$packageName" 