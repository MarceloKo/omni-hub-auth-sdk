#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "❌ package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Verificar se o tipo de versão foi fornecido
VERSION_TYPE=$1
if [ -z "$VERSION_TYPE" ]; then
    print_info "📝 Uso: ./scripts/publish.sh [patch|minor|major]"
    print_info "   patch: 1.0.1 -> 1.0.2 (correções de bugs)"
    print_info "   minor: 1.0.1 -> 1.1.0 (novas funcionalidades)"
    print_info "   major: 1.0.1 -> 2.0.0 (mudanças que quebram compatibilidade)"
    exit 1
fi

# Validar tipo de versão
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "❌ Tipo de versão inválido. Use: patch, minor ou major"
    exit 1
fi

print_message "🚀 Iniciando processo de publicação..."

# Verificar se git está instalado
if ! command_exists git; then
    print_error "❌ Git não está instalado"
    exit 1
fi

# Verificar se npm está instalado
if ! command_exists npm; then
    print_error "❌ NPM não está instalado"
    exit 1
fi

# Verificar se há mudanças não commitadas
print_info "🔍 Verificando mudanças não commitadas..."
if [ -n "$(git status --porcelain)" ]; then
    print_error "❌ Existem mudanças não commitadas. Faça commit antes de publicar."
    git status
    exit 1
fi

# Verificar se está na branch main/master
print_info "🔍 Verificando branch atual..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    print_error "❌ Você está na branch \"$CURRENT_BRANCH\". Publique apenas da branch main/master."
    exit 1
fi

# Verificar se está logado no npm
print_info "🔍 Verificando login no npm..."
if ! npm whoami >/dev/null 2>&1; then
    print_error "❌ Você não está logado no npm. Execute 'npm login' primeiro."
    exit 1
fi

# Obter versão atual
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "📋 Versão atual: $CURRENT_VERSION"

# Atualizar versão
print_message "🔄 Atualizando versão..."
npm version "$VERSION_TYPE" --no-git-tag-version

# Obter nova versão
NEW_VERSION=$(node -p "require('./package.json').version")
print_info "📋 Nova versão: $NEW_VERSION"

# Executar verificações
print_message "🧪 Executando verificações..."
if ! npm run type-check; then
    print_error "❌ Verificação de tipos falhou"
    exit 1
fi

if ! npm run lint:check; then
    print_error "❌ Verificação de lint falhou"
    exit 1
fi

# Build
print_message "🔨 Fazendo build..."
if ! npm run build; then
    print_error "❌ Build falhou"
    exit 1
fi

# Commit das mudanças
print_message "💾 Fazendo commit das mudanças..."
git add .
git commit -m "chore: bump version to $NEW_VERSION"

# Criar tag
print_message "🏷️ Criando tag..."
git tag "v$NEW_VERSION"

# Push das mudanças e tag
print_message "📤 Fazendo push das mudanças..."
git push origin "$CURRENT_BRANCH"
git push origin "v$NEW_VERSION"

# Publicar no npm
print_message "📦 Publicando no npm..."
if ! npm publish; then
    print_error "❌ Publicação no npm falhou"
    exit 1
fi

# Sucesso
print_message "🎉 Publicação concluída com sucesso!"
print_message "📦 Versão $NEW_VERSION publicada no npm"

# Obter nome do pacote
PACKAGE_NAME=$(node -p "require('./package.json').name")
print_message "🔗 https://www.npmjs.com/package/$PACKAGE_NAME" 