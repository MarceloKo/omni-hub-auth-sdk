import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { OmniHubSDK } from '../src';
import type { LoginResponse, User } from '../src/types';

// Configuração do SDK
const sdk = new OmniHubSDK({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
});

// Context para o SDK
interface SDKContextType {
  sdk: OmniHubSDK;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const SDKContext = createContext<SDKContextType | null>(null);

// Provider do SDK
interface SDKProviderProps {
  children: ReactNode;
}

export const SDKProvider: React.FC<SDKProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao inicializar
  useEffect(() => {
    checkAuthState();
  }, []);

  // Configurar callback de erro de autenticação
  useEffect(() => {
    sdk.setAuthErrorCallback(() => {
      setUser(null);
      localStorage.removeItem('omni_auth_token');
      localStorage.removeItem('omni_refresh_token');
      localStorage.removeItem('omni_workspace_id');
      localStorage.removeItem('omni_user_data');
    });
  }, []);

  const checkAuthState = async () => {
    try {
      const token = localStorage.getItem('omni_auth_token');
      const refreshToken = localStorage.getItem('omni_refresh_token');
      const workspaceId = localStorage.getItem('omni_workspace_id');
      const userData = localStorage.getItem('omni_user_data');

      if (token && refreshToken && workspaceId && userData) {
        sdk.setAuth(token, refreshToken, workspaceId);
        
        // Validar se o token ainda é válido
        const validation = await sdk.auth.validate({ token });
        
        if (validation.valid && validation.user) {
          setUser(JSON.parse(userData));
        } else {
          // Token inválido, limpar dados
          logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response: LoginResponse = await sdk.auth.login({
        email,
        password
      });

      // Configurar SDK
      const workspaceId = response.workspaces[0]?.id;
      if (!workspaceId) {
        throw new Error('Nenhum workspace disponível');
      }

      sdk.setAuth(response.token, response.refreshToken, workspaceId);

      // Salvar no localStorage
      localStorage.setItem('omni_auth_token', response.token);
      localStorage.setItem('omni_refresh_token', response.refreshToken);
      localStorage.setItem('omni_workspace_id', workspaceId);
      localStorage.setItem('omni_user_data', JSON.stringify(response.user));

      setUser(response.user as User);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await sdk.auth.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      sdk.clearAuth();
      setUser(null);
      
      // Limpar localStorage
      localStorage.removeItem('omni_auth_token');
      localStorage.removeItem('omni_refresh_token');
      localStorage.removeItem('omni_workspace_id');
      localStorage.removeItem('omni_user_data');
    }
  };

  const contextValue: SDKContextType = {
    sdk,
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <SDKContext.Provider value={contextValue}>
      {children}
    </SDKContext.Provider>
  );
};

// Hook para usar o SDK
export const useSDK = (): SDKContextType => {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDK deve ser usado dentro de um SDKProvider');
  }
  return context;
};

// Componente de exemplo: Login
export const LoginComponent: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useSDK();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      if (err && 'errors' in err) {
        setError(err.errors.join(', '));
      } else {
        setError('Erro no login. Tente novamente.');
      }
    }
  };

  if (isAuthenticated) {
    return <div>Você já está logado!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

// Componente de exemplo: Lista de Clientes
export const CustomersList: React.FC = () => {
  const { sdk, isAuthenticated } = useSDK();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await sdk.customers.getAll({
        page: 1,
        limit: 10
      });
      
      setCustomers(response.response);
    } catch (err: any) {
      if (err && 'errors' in err) {
        setError(err.errors.join(', '));
      } else {
        setError('Erro ao carregar clientes');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Faça login para ver os clientes</div>;
  }

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Erro: {error}</div>;
  }

  return (
    <div>
      <h2>Lista de Clientes</h2>
      {customers.length === 0 ? (
        <p>Nenhum cliente encontrado</p>
      ) : (
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}>
              <strong>{customer.name}</strong> - {customer.email}
              <br />
              <small>CPF: {customer.cpf}</small>
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={loadCustomers}>
        Recarregar
      </button>
    </div>
  );
};

// Componente principal da aplicação
export const App: React.FC = () => {
  return (
    <SDKProvider>
      <div>
        <h1>Exemplo de Integração React + OmniHub SDK</h1>
        <AuthStatus />
        <LoginComponent />
        <CustomersList />
      </div>
    </SDKProvider>
  );
};

// Componente para mostrar status de autenticação
const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, logout } = useSDK();

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <p>Olá, {user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};