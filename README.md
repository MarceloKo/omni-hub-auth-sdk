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
import { OmniHubSDK } from "@omni-hub/auth-sdk";

const sdk = new OmniHubSDK({
  baseURL: "https://auth-api.omnihub.com.br",
  timeout: 10000,
  onAuthError: () => {
    // Redirecionar para login ou mostrar modal
    window.location.href = "/login";
  },
});
```

### Autenticação

```typescript
// Login
try {
  const loginResponse = await sdk.auth.login({
    email: "usuario@empresa.com",
    password: "senha123",
    integrationType: "API", // opcional: 'API' | 'SSO' | 'PANEL'
  });

  // SDK automaticamente configura os tokens
  sdk.setAuth(
    loginResponse.token,
    loginResponse.refreshToken,
    loginResponse.workspaces[0].id
  );

  console.log("Login realizado com sucesso!", loginResponse.user);
} catch (error) {
  console.error("Erro no login:", error.errors);
}

// Validar token
const validation = await sdk.auth.validate();
console.log("Token válido:", validation.valid);

// Refresh token
const newTokens = await sdk.auth.refresh({
  refreshToken: "seu-refresh-token",
});

// Logout
await sdk.auth.logout({
  refreshToken: "seu-refresh-token",
});
sdk.clearAuth();
```

### Gerenciamento de Usuários

```typescript
// Listar usuários
const users = await sdk.users.getUsers({
  page: 1,
  limit: 10,
  name: "João",
  is_locked: false,
});

// Criar usuário
const newUser = await sdk.users.createUser({
  email: "novo@empresa.com",
  name: "Novo Usuário",
  password: "senha123",
  permission_group_id: "group-id",
});

// Atualizar usuário
await sdk.users.updateUser("user-id", {
  name: "Nome Atualizado",
  permission_group_id: "new-group-id",
});

// Bloquear/desbloquear usuário
await sdk.users.updateUserStatus("user-id", {
  action: "block", // ou 'unblock'
});
```

### Gerenciamento de Permissões

```typescript
// Listar permissões
const permissions = await sdk.permissions.getPermissions({
  page: 1,
  limit: 20,
});

// Criar permissão
const permission = await sdk.permissions.createPermission({
  name: "read_users",
  description: "Permissão para ler usuários",
});

// Relatório de permissões
const report = await sdk.permissions.getPermissionsReport();
console.log("Total de permissões:", report.total_permissions);
```

### Grupos de Permissões

```typescript
// Listar grupos
const groups = await sdk.permissionGroups.getPermissionGroups({
  page: 1,
  limit: 10,
});

// Criar grupo
const group = await sdk.permissionGroups.createPermissionGroup({
  name: "Administradores",
  description: "Grupo de administradores",
  permissions_ids: ["perm-1", "perm-2"],
  users_ids: ["user-1", "user-2"],
});
```

### Permissões de Usuário

```typescript
// Atribuir permissão
await sdk.userPermissions.assignPermission({
  user_id: "user-id",
  permission_id: "permission-id",
});

// Atribuir múltiplas permissões
await sdk.userPermissions.bulkAssignPermissions({
  user_id: "user-id",
  permission_ids: ["perm-1", "perm-2", "perm-3"],
});

// Listar permissões do usuário
const userPermissions = await sdk.userPermissions.getUserPermissions(
  "user-id",
  {
    page: 1,
    limit: 20,
  }
);
```

### Sessões

```typescript
// Listar sessões ativas
const sessions = await sdk.sessions.getSessions();

// Encerrar sessão específica
await sdk.sessions.terminateSession("session-id");

// Encerrar outras sessões
const result = await sdk.sessions.terminateOtherSessions();
console.log("Sessões encerradas:", result.sessions_terminated);
```

### SSO (Single Sign-On)

```typescript
// Obter URL de autorização
const authUrl = await sdk.sso.getAuthorizationEndpoint({
  client_id: "client-id",
  redirect_uri: "https://app.com/callback",
  response_type: "code",
  scope: "read write",
  state: "random-state",
});

// Trocar código por token
const tokens = await sdk.sso.getToken({
  grant_type: "authorization_code",
  client_id: "client-id",
  client_secret: "client-secret",
  code: "authorization-code",
  redirect_uri: "https://app.com/callback",
});

// Obter informações da integração
const integration = await sdk.sso.getIntegration("client-id");
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

## 📚 API Reference

### Configuração

```typescript
interface OmniHubSDKConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  onAuthError?: () => void;
}
```

### Autenticação

```typescript
// Login
auth.login(data: LoginRequest): Promise<LoginResponse>

// Refresh token
auth.refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse>

// Validar token
auth.validate(): Promise<ValidateTokenResponse>

// Logout
auth.logout(data: LogoutRequest): Promise<void>
```

### Usuários

```typescript
// Listar usuários
users.getUsers(params?: ListUsersQueryParams): Promise<ListUsersResponse>

// Criar usuário
users.createUser(data: CreateUserRequest): Promise<CreateUserResponse>

// Buscar usuário por ID
users.getUserById(id: string): Promise<UserDetail>

// Atualizar usuário
users.updateUser(id: string, data: UpdateUserRequest): Promise<void>

// Atualizar status
users.updateUserStatus(id: string, data: UpdateUserStatusRequest): Promise<void>
```

### Permissões

```typescript
// Listar permissões
permissions.getPermissions(params?: ListPermissionsQueryParams): Promise<ListPermissionsResponse>

// Criar permissão
permissions.createPermission(data: CreatePermissionRequest): Promise<Permission>

// Relatório
permissions.getPermissionsReport(): Promise<PermissionsReport>

// Atualizar permissão
permissions.updatePermission(id: string, data: UpdatePermissionRequest): Promise<Permission>

// Deletar permissão
permissions.deletePermission(id: string): Promise<void>
```

### Grupos de Permissões

```typescript
// Listar grupos
permissionGroups.getPermissionGroups(params?: ListPermissionGroupsQueryParams): Promise<ListPermissionGroupsResponse>

// Criar grupo
permissionGroups.createPermissionGroup(data: CreatePermissionGroupRequest): Promise<PermissionGroup>

// Atualizar grupo
permissionGroups.updatePermissionGroup(id: string, data: UpdatePermissionGroupRequest): Promise<PermissionGroup>

// Deletar grupo
permissionGroups.deletePermissionGroup(id: string): Promise<void>
```

### Permissões de Usuário

```typescript
// Atribuir permissão
userPermissions.assignPermission(data: AssignPermissionRequest): Promise<void>

// Remover permissão
userPermissions.removePermission(data: RemovePermissionRequest): Promise<void>

// Atribuir múltiplas permissões
userPermissions.bulkAssignPermissions(data: BulkAssignPermissionsRequest): Promise<void>

// Remover múltiplas permissões
userPermissions.bulkRemovePermissions(data: BulkRemovePermissionsRequest): Promise<void>

// Listar permissões do usuário
userPermissions.getUserPermissions(userId: string, params?: ListUserPermissionsQueryParams): Promise<ListUserPermissionsResponse>

// Listar permissões disponíveis
userPermissions.getAvailablePermissions(userId: string, params?: ListUserPermissionsQueryParams): Promise<ListUserPermissionsResponse>
```

### Sessões

```typescript
// Listar sessões
sessions.getSessions(): Promise<Session[]>

// Encerrar sessão específica
sessions.terminateSession(sessionId: string): Promise<void>

// Encerrar outras sessões
sessions.terminateOtherSessions(): Promise<TerminateSessionsResponse>

// Encerrar todas as sessões
sessions.terminateAllSessions(): Promise<TerminateSessionsResponse>
```

### SSO

```typescript
// Obter URL de autorização
sso.getAuthorizationEndpoint(params: SSOAuthorizationParams): Promise<string>

// Trocar código por token
sso.getToken(data: SSOTokenRequest): Promise<SSOTokenResponse>

// Autenticar usuário
sso.authenticate(data: SSOAuthenticateRequest): Promise<SSOAuthenticateResponse>

// Obter integração
sso.getIntegration(clientId: string): Promise<SSOIntegration>
```

---
