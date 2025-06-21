import { OmniHubSDK } from '../src';

// Configuração básica do SDK
const sdk = new OmniHubSDK({
  baseURL: 'http://localhost:8000', // URL do seu backend
  timeout: 10000,
  onAuthError: () => {
    console.log('Erro de autenticação - redirecionando para login');
    // Em uma aplicação real, você redirecionaria para a tela de login
  }
});

async function exemploCompleto() {
  try {
    // 1. AUTENTICAÇÃO
    console.log('=== EXEMPLO DE AUTENTICAÇÃO ===');
    
    const loginResponse = await sdk.auth.login({
      email: 'admin@test.com',
      password: 'password123'
    });
    
    console.log('Login realizado com sucesso!');
    console.log('Usuário:', loginResponse.user.name);
    console.log('Workspaces disponíveis:', loginResponse.workspaces.length);
    
    // Configurar autenticação no SDK
    sdk.setAuth(
      loginResponse.token,
      loginResponse.refreshToken,
      loginResponse.workspaces[0].id // Usar o primeiro workspace
    );
    
    // 2. GERENCIAMENTO DE CLIENTES
    console.log('\n=== EXEMPLO DE CLIENTES ===');
    
    // Listar clientes existentes
    const clientesExistentes = await sdk.customers.getAll({
      page: 1,
      limit: 5
    });
    
    console.log(`Total de clientes: ${clientesExistentes.pagination.total}`);
    console.log('Primeiros 5 clientes:');
    clientesExistentes.response.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.name} - ${cliente.email}`);
    });
    
    // Criar novo cliente
    const novoCliente = await sdk.customers.create({
      name: 'João da Silva Santos',
      email: 'joao.santos@email.com',
      cpf: '12345678901',
      phone: '11999887766',
      rg: 'MG1234567'
    });
    
    console.log('Cliente criado com sucesso!');
    console.log(`ID: ${novoCliente.id}`);
    console.log(`Nome: ${novoCliente.name}`);
    
    // Buscar cliente específico
    const clienteBuscado = await sdk.customers.getById(novoCliente.id);
    console.log('Cliente encontrado:', clienteBuscado.name);
    
    // Atualizar cliente
    const clienteAtualizado = await sdk.customers.update(novoCliente.id, {
      name: 'João da Silva Santos Junior',
      phone: '11888776655'
    });
    
    console.log('Cliente atualizado:', clienteAtualizado.name);
    
    // Obter estatísticas
    const estatisticas = await sdk.customers.getStatistics();
    console.log('\nEstatísticas de clientes:');
    console.log(`- Total: ${estatisticas.total}`);
    console.log(`- Ativos: ${estatisticas.active}`);
    console.log(`- Novos este mês: ${estatisticas.total_last_month}`);
    
    // Buscar clientes
    const resultadoBusca = await sdk.customers.search('João', 3);
    console.log(`\nEncontrados ${resultadoBusca.length} clientes com "João":`);
    resultadoBusca.forEach(cliente => {
      console.log(`- ${cliente.name}`);
    });
    
    // Filtrar clientes
    const clientesFiltrados = await sdk.customers.getAll({
      name: 'Silva',
      limit: 10
    });
    console.log(`Clientes com "Silva" no nome: ${clientesFiltrados.response.length}`);
    
    // 3. VALIDAÇÃO DE TOKEN
    console.log('\n=== VALIDAÇÃO DE TOKEN ===');
    
    const tokens = sdk.getAuthTokens();
    if (tokens) {
      const validacao = await sdk.auth.validate({
        token: tokens.token
      });
      
      console.log('Token é válido:', validacao.valid);
      if (validacao.user) {
        console.log('Usuário do token:', validacao.user.name);
      }
    }
    
    // 4. LOGOUT
    console.log('\n=== LOGOUT ===');
    
    await sdk.auth.logout();
    sdk.clearAuth();
    console.log('Logout realizado com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a execução:', error);
    
    // Tratamento específico para erros da API
    if (error && typeof error === 'object' && 'errors' in error) {
      console.error('Erros da API:');
      (error as any).errors.forEach((msg: string) => {
        console.error(`- ${msg}`);
      });
    }
  }
}

// Executar exemplo se este arquivo for chamado diretamente
if (require.main === module) {
  exemploCompleto()
    .then(() => {
      console.log('\n✅ Exemplo executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro na execução do exemplo:', error);
      process.exit(1);
    });
}

export { exemploCompleto };