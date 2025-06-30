# Scripts de Publicação

Este diretório contém scripts para automatizar o processo de versionamento e publicação do SDK no npm.

## 📦 Scripts Disponíveis

### Node.js (Cross-platform)

```bash
# Publicar patch (1.0.1 -> 1.0.2)
npm run publish:patch

# Publicar minor (1.0.1 -> 1.1.0)
npm run publish:minor

# Publicar major (1.0.1 -> 2.0.0)
npm run publish:major

# Dry run (apenas build e pack, sem publicar)
npm run publish:dry-run
```

### Bash (Linux/macOS)

```bash
# Publicar patch
./scripts/publish.sh patch

# Publicar minor
./scripts/publish.sh minor

# Publicar major
./scripts/publish.sh major
```

### PowerShell (Windows)

```powershell
# Publicar patch
.\scripts\publish.ps1 patch

# Publicar minor
.\scripts\publish.ps1 minor

# Publicar major
.\scripts\publish.ps1 major
```

## 🔄 O que os Scripts Fazem

1. **Verificações Prévias**:

   - ✅ Verifica se há mudanças não commitadas
   - ✅ Verifica se está na branch main/master
   - ✅ Verifica se está logado no npm
   - ✅ Verifica se git e npm estão instalados

2. **Versionamento**:

   - 🔄 Atualiza a versão no package.json
   - 📋 Exibe a versão atual e nova

3. **Qualidade**:

   - 🧪 Executa verificação de tipos TypeScript
   - 🔍 Executa verificação de lint
   - 🔨 Faz build do projeto

4. **Git**:

   - 💾 Faz commit das mudanças
   - 🏷️ Cria tag da versão
   - 📤 Faz push das mudanças e tag

5. **Publicação**:
   - 📦 Publica no npm
   - 🎉 Exibe mensagem de sucesso com link

## 📋 Tipos de Versão

### Patch (1.0.1 -> 1.0.2)

- Correções de bugs
- Melhorias de performance
- Correções de documentação
- Não quebram compatibilidade

### Minor (1.0.1 -> 1.1.0)

- Novas funcionalidades
- Melhorias em funcionalidades existentes
- Não quebram compatibilidade

### Major (1.0.1 -> 2.0.0)

- Mudanças que quebram compatibilidade
- Refatorações significativas
- Remoção de funcionalidades

## ⚠️ Pré-requisitos

1. **Git configurado**:

   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

2. **NPM logado**:

   ```bash
   npm login
   ```

3. **Branch correta**:

   - Deve estar na branch `main` ou `master`
   - Todas as mudanças devem estar commitadas

4. **Permissões**:
   - Deve ter permissão para publicar no pacote
   - Deve ter permissão para fazer push no repositório

## 🚨 Troubleshooting

### Erro: "Existem mudanças não commitadas"

```bash
git add .
git commit -m "feat: suas mudanças"
```

### Erro: "Você não está logado no npm"

```bash
npm login
```

### Erro: "Você está na branch incorreta"

```bash
git checkout main
```

### Erro: "Build falhou"

```bash
npm run build
# Verifique os erros e corrija
```

### Erro: "Publicação no npm falhou"

- Verifique se tem permissão para publicar
- Verifique se o nome do pacote está correto
- Verifique se não há conflitos de versão

## 🔧 Configuração Avançada

### Personalizar Mensagens de Commit

Edite o arquivo `scripts/publish.js` e modifique a linha:

```javascript
execCommand(`git commit -m "chore: bump version to ${newVersion}"`);
```

### Adicionar Verificações Extras

Adicione verificações antes da publicação:

```javascript
// Executar testes
execCommand("npm test");
```

### Publicar em Registry Diferente

```bash
npm publish --registry=https://registry.npmjs.org/
```

## 📚 Links Úteis

- [Semantic Versioning](https://semver.org/)
- [NPM Publishing](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Git Tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
