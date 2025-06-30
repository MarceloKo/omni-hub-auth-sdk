import type { HttpClient } from '../core/http-client'
import type {
	SSOAuthorizationParams,
	SSOTokenRequest,
	SSOTokenResponse,
	SSOAuthenticateRequest,
	SSOAuthenticateResponse,
	SSOIntegration,
} from '../types/sso'

export class SSOService {
	constructor(private httpClient: HttpClient) { }

	async getAuthorizationEndpoint(params: SSOAuthorizationParams): Promise<string> {
		const queryParams = new URLSearchParams()
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				queryParams.append(key, value)
			}
		})
		return `${this.httpClient.getBaseURL()}/v1/sso/authorization-endpoint?${queryParams.toString()}`
	}

	async getToken(data: SSOTokenRequest): Promise<SSOTokenResponse> {
		return this.httpClient.post<SSOTokenResponse>('/v1/sso/token', data)
	}

	async authenticate(data: SSOAuthenticateRequest): Promise<SSOAuthenticateResponse> {
		return this.httpClient.post<SSOAuthenticateResponse>('/v1/sso/authenticate', data)
	}

	async getIntegration(clientId: string): Promise<SSOIntegration> {
		return this.httpClient.get<SSOIntegration>(`/v1/sso/integration/${clientId}`)
	}
}
