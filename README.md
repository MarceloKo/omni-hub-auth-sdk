# OmniHub Auth SDK

SDK oficial para integração com o serviço de autenticação da plataforma OmniHub - solução completa para gestão empresarial modular.

## 🚀 Instalação

```bash
npm install @omni-hub/auth-sdk
# ou
yarn add @omni-hub/auth-sdk
```

## 📋 Características

- ✅ **TypeScript nativo** - Tipagem completa e autocomplete
- ✅ **Autenticação automática** - JWT com refresh automático
- ✅ **Interceptadores inteligentes** - Tratamento de erros e retry automático
- ✅ **Modular** - Use apenas os módulos necessários
- ✅ **Axios sob o capô** - HTTP client confiável e performático
- ✅ **Multi-workspace** - Suporte completo a workspaces
- ✅ **Offline-first** - Gerenciamento inteligente de tokens
- ✅ **Biome** - Linting e formatação padronizada

## 🏁 Início Rápido

### Configuração Básica

```typescript
import { OmniHubSDK } from '@omni-hub/auth-sdk';

const sdk = new OmniHubSDK({
  baseURL: 'https://auth-api.omnihub.com.br',
  timeout: 10000,
  onAuthError: () => {
    // Redirecionar para login ou mostrar modal
    window.location.href = '/login';
  }
});
```

### Autenticação

```typescript
// Login
try {
  const loginResponse = await sdk.auth.login({
    email: 'usuario@empresa.com',
    password: 'senha123'
  });

  // SDK automaticamente configura os tokens
  sdk.setAuth(
    loginResponse.token,
    loginResponse.refreshToken,
    loginResponse.workspaces[0].id
  );

  console.log('Login realizado com sucesso\!', loginResponse.user);
} catch (error) {
  console.error('Erro no login:', error.errors);
}

// Logout
await sdk.auth.logout();
sdk.clearAuth();
```

## 🛠️ Desenvolvimento

### Comandos Disponíveis

```bash
# Instalar dependências
yarn install

# Desenvolvimento
yarn dev              # Build em modo watch

# Qualidade de código
yarn lint             # Formatar e corrigir com Biome
yarn lint:check       # Verificar apenas (sem corrigir)
yarn type-check       # Verificação de tipos TypeScript

# Build e testes
yarn build            # Build para produção
yarn test             # Executar testes
yarn test:watch       # Testes em modo watch
```

### Padrões de Código

O projeto utiliza **Biome** para formatação e linting:

- **Indentação**: Tabs
- **Aspas**: Simples (`'`)
- **Ponto e vírgula**: Apenas quando necessário
- **Largura de linha**: 200 caracteres
- **Imports**: Organizados automaticamente

---

**Documentação da API Auth completa:** [https://docs.omnihub.com.br/auth-api](https://docs.omnihub.com.br/auth-api)
