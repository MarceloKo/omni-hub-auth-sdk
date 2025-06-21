import type { HttpClient } from '../core/http-client'
import type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, RegisterRequest, ValidateTokenRequest, ValidateTokenResponse } from '../types/auth'

export class AuthService {
	constructor(private httpClient: HttpClient) {}

	async login(data: LoginRequest): Promise<LoginResponse> {
		return this.httpClient.post<LoginResponse>('/v1/authenticate/login', data)
	}

	async register(data: RegisterRequest): Promise<LoginResponse> {
		return this.httpClient.post<LoginResponse>('/v1/authenticate/register', data)
	}

	async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
		return this.httpClient.post<RefreshTokenResponse>('/v1/authenticate/refresh', data)
	}

	async validate(data: ValidateTokenRequest): Promise<ValidateTokenResponse> {
		return this.httpClient.post<ValidateTokenResponse>('/v1/authenticate/validate', data)
	}

	async logout(): Promise<{ message: string }> {
		return this.httpClient.post<{ message: string }>('/v1/authenticate/logout')
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
