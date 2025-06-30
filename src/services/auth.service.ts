import type { HttpClient } from '../core/http-client'
import type { LoginRequest, LoginResponse, LogoutRequest, RefreshTokenRequest, RefreshTokenResponse, ValidateTokenResponse } from '../types/auth'

export class AuthService {
	constructor(private httpClient: HttpClient) {}

	async login(data: LoginRequest): Promise<LoginResponse> {
		return this.httpClient.post<LoginResponse>('/v1/authenticate/login', data)
	}

	async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
		return this.httpClient.post<RefreshTokenResponse>('/v1/authenticate/refresh/', data)
	}

	async validate(): Promise<ValidateTokenResponse> {
		return this.httpClient.get<ValidateTokenResponse>('/v1/authenticate/validate/')
	}

	async logout(data: LogoutRequest): Promise<void> {
		return this.httpClient.post<void>('/v1/authenticate/logout/', data)
	}

	clearAuth() {
		this.httpClient.clearAuth()
	}

	setAuth(token: string, refreshToken: string, workspaceId: string) {
		this.httpClient.setAuth(token, refreshToken, workspaceId)
	}

	getAuthTokens() {
		return this.httpClient.getAuthTokens()
	}

	getWorkspaceId() {
		return this.httpClient.getWorkspaceId()
	}
}
