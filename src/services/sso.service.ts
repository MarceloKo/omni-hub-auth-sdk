import type { HttpClient } from '../core/http-client'
import type { SSOAuthParams, SSOAuthenticateRequest, SSOIntegrationInfo, SSOTokenRequest, SSOTokenResponse } from '../types/sso'

export class SSOService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * Gera a URL de autorização SSO para redirecionar o usuário
	 */
	getAuthorizationUrl(params: SSOAuthParams): string {
		const baseUrl = this.httpClient.getBaseURL()
		const url = new URL('/v1/sso/auth', baseUrl)

		url.searchParams.append('client_id', params.client_id)
		url.searchParams.append('redirect_uri', params.redirect_uri)
		url.searchParams.append('response_type', params.response_type || 'code')

		if (params.scope) {
			url.searchParams.append('scope', params.scope)
		}

		if (params.state) {
			url.searchParams.append('state', params.state)
		}

		return url.toString()
	}

	/**
	 * Troca o authorization code por tokens de acesso
	 */
	async exchangeCodeForToken(data: SSOTokenRequest): Promise<SSOTokenResponse> {
		return this.httpClient.post<SSOTokenResponse>('/v1/sso/token', data)
	}

	/**
	 * Autentica usuário no fluxo SSO
	 */
	async authenticate(data: SSOAuthenticateRequest): Promise<{ success: boolean }> {
		return this.httpClient.post<{ success: boolean }>('/v1/sso/authenticate', data)
	}

	/**
	 * Obtém informações da integração SSO
	 */
	async getIntegrationInfo(clientId: string): Promise<SSOIntegrationInfo> {
		return this.httpClient.get<SSOIntegrationInfo>(`/v1/sso/integration/${clientId}`)
	}
}
