import { OmniHubSDK } from '../src';
import type { ApiErrorResponse } from '../src/types';

const sdk = new OmniHubSDK({
  baseURL: 'http://localhost:8000',
  onAuthError: () => {
    console.log('Erro de autenticação detectado!');
  }
});

// Função auxiliar para verificar se é erro da API
function isApiError(error: any): error is ApiErrorResponse {
  return error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors);
}

// Exemplo 1: Tratamento de erros de validação
async function exemploErrosValidacao() {
  console.log('=== EXEMPLO DE ERROS DE VALIDAÇÃO ===');
  
  try {
    // Tentar criar cliente com dados inválidos
    await sdk.customers.create({
      name: '', // Nome vazio - deve dar erro
      email: 'email-invalido', // Email inválido
      cpf: '123', // CPF muito curto
    });
  } catch (error) {
    if (isApiError(error)) {
      console.log('Erros de validação encontrados:');
      error.errors.forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg}`);
      });
    } else {
      console.error('Erro inesperado:', error);
    }
  }
}

// Exemplo 2: Tratamento de erros de autenticação
async function exemploErrosAutenticacao() {
  console.log('\n=== EXEMPLO DE ERROS DE AUTENTICAÇÃO ===');
  
  try {
    // Tentar fazer login com credenciais inválidas
    await sdk.auth.login({
      email: 'usuario@inexistente.com',
      password: 'senha-errada'
    });
  } catch (error) {
    if (isApiError(error)) {
      console.log('Erro de autenticação:');
      error.errors.forEach(msg => {
        console.log(`  - ${msg}`);
      });
    } else {
      console.error('Erro inesperado na autenticação:', error);
    }
  }
}

// Exemplo 3: Tratamento de erro de recurso não encontrado
async function exemploRecursoNaoEncontrado() {
  console.log('\n=== EXEMPLO DE RECURSO NÃO ENCONTRADO ===');
  
  // Fazer login primeiro
  try {
    await sdk.auth.login({
      email: 'admin@test.com',
      password: 'password123'
    });
  } catch (error) {
    console.log('Não foi possível fazer login para este exemplo');
    return;
  }
  
  try {
    // Tentar buscar cliente que não existe
    await sdk.customers.getById('cliente-inexistente-id');
  } catch (error) {
    if (isApiError(error)) {
      console.log('Cliente não encontrado:');
      error.errors.forEach(msg => {
        console.log(`  - ${msg}`);
      });
    } else {
      console.error('Erro inesperado:', error);
    }
  }
}

// Exemplo 4: Tratamento de erro de rede
async function exemploErroRede() {
  console.log('\n=== EXEMPLO DE ERRO DE REDE ===');
  
  // Criar SDK com URL inválida para simular erro de rede
  const sdkComErro = new OmniHubSDK({
    baseURL: 'http://servidor-inexistente.com',
    timeout: 2000, // Timeout baixo para falhar rapidamente
  });
  
  try {
    await sdkComErro.auth.login({
      email: 'test@test.com',
      password: 'password'
    });
  } catch (error) {
    if (isApiError(error)) {
      console.log('Erro da API:');
      error.errors.forEach(msg => {
        console.log(`  - ${msg}`);
      });
    } else if (error instanceof Error) {
      console.log('Erro de rede ou timeout:');
      console.log(`  - ${error.message}`);
    } else {
      console.error('Erro desconhecido:', error);
    }
  }
}

// Exemplo 5: Wrapper para tratamento centralizado de erros
class ErrorHandler {
  static handle(error: unknown, context = 'Operação') {
    console.error(`\n[${context}] Erro capturado:`);
    
    if (isApiError(error)) {
      console.error('Tipo: Erro da API');
      console.error('Mensagens:');
      error.errors.forEach((msg, index) => {
        console.error(`  ${index + 1}. ${msg}`);
      });
      
      // Retornar mensagem amigável para o usuário
      return {
        type: 'api_error',
        message: error.errors.join('. '),
        userMessage: 'Alguns dados enviados são inválidos. Verifique e tente novamente.'
      };
    }
    
    if (error instanceof Error) {
      console.error('Tipo: Erro JavaScript');
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      // Verificar tipos específicos de erro
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        return {
          type: 'network_error',
          message: error.message,
          userMessage: 'Problema de conexão. Verifique sua internet e tente novamente.'
        };
      }
      
      return {
        type: 'generic_error',
        message: error.message,
        userMessage: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.'
      };
    }
    
    console.error('Tipo: Erro desconhecido');
    console.error('Conteúdo:', error);
    
    return {
      type: 'unknown_error',
      message: 'Erro desconhecido',
      userMessage: 'Ocorreu um problema inesperado. Entre em contato com o suporte.'
    };
  }
}

// Exemplo 6: Uso do wrapper de tratamento de erros
async function exemploTratamentoCentralizado() {
  console.log('\n=== EXEMPLO DE TRATAMENTO CENTRALIZADO ===');
  
  // Operação que vai dar erro de validação
  try {
    await sdk.customers.create({
      name: '',
      email: 'email-invalido',
      cpf: '123'
    });
  } catch (error) {
    const result = ErrorHandler.handle(error, 'Criação de Cliente');
    console.log('\nMensagem para o usuário:', result.userMessage);
    console.log('Tipo do erro:', result.type);
  }
  
  // Operação que vai dar erro de rede
  try {
    const sdkErro = new OmniHubSDK({
      baseURL: 'http://localhost:9999', // Porta que não existe
      timeout: 1000
    });
    
    await sdkErro.customers.getAll();
  } catch (error) {
    const result = ErrorHandler.handle(error, 'Listagem de Clientes');
    console.log('\nMensagem para o usuário:', result.userMessage);
    console.log('Tipo do erro:', result.type);
  }
}

// Exemplo 7: Retry automático para erros temporários
async function exemploRetryAutomatico() {
  console.log('\n=== EXEMPLO DE RETRY AUTOMÁTICO ===');
  
  async function tentarOperacaoComRetry<T>(
    operacao: () => Promise<T>,
    maxTentativas = 3,
    delayMs = 1000
  ): Promise<T> {
    let ultimoErro: unknown;
    
    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        console.log(`Tentativa ${tentativa}/${maxTentativas}...`);
        return await operacao();
      } catch (error) {
        ultimoErro = error;
        
        // Verificar se é um erro que vale a pena tentar novamente
        if (isApiError(error)) {
          // Erros de validação não devem ser retentados
          console.log('Erro de validação - não tentando novamente');
          throw error;
        }
        
        if (tentativa < maxTentativas) {
          console.log(`Tentativa ${tentativa} falhou, aguardando ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    console.log('Todas as tentativas falharam');
    throw ultimoErro;
  }
  
  // Exemplo de uso do retry
  try {
    const clientes = await tentarOperacaoComRetry(
      () => sdk.customers.getAll({ page: 1, limit: 5 }),
      3,
      2000
    );
    
    console.log(`Sucesso após retry! Encontrados ${clientes.pagination.total} clientes`);
  } catch (error) {
    const result = ErrorHandler.handle(error, 'Listagem com Retry');
    console.log('Falhou mesmo com retry:', result.userMessage);
  }
}

// Executar todos os exemplos
async function executarExemplos() {
  await exemploErrosValidacao();
  await exemploErrosAutenticacao();
  await exemploRecursoNaoEncontrado();
  await exemploErroRede();
  await exemploTratamentoCentralizado();
  await exemploRetryAutomatico();
}

// Executar se chamado diretamente
if (require.main === module) {
  executarExemplos()
    .then(() => {
      console.log('\n✅ Todos os exemplos de tratamento de erro executados!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro ao executar exemplos:', error);
      process.exit(1);
    });
}

export {
  exemploErrosValidacao,
  exemploErrosAutenticacao,
  exemploRecursoNaoEncontrado,
  exemploErroRede,
  ErrorHandler,
  isApiError
};