import { HttpClient } from './core/http-client'
import { AuthService, PermissionGroupsService, PermissionsService, SSOService, SessionsService, UserPermissionsService, UsersService } from './services'
import type { HttpClientConfig } from './types/api'

export interface OmniHubSDKConfig {
	baseURL: string
	timeout?: number
	headers?: Record<string, string>
	onAuthError?: () => void
}

export class OmniHubSDK {
	private httpClient: HttpClient

	public readonly auth: AuthService
	public readonly sso: SSOService
	public readonly users: UsersService
	public readonly sessions: SessionsService
	public readonly permissions: PermissionsService
	public readonly permissionGroups: PermissionGroupsService
	public readonly userPermissions: UserPermissionsService

	constructor(config: OmniHubSDKConfig) {
		const httpConfig: HttpClientConfig = {
			baseURL: config.baseURL,
			timeout: config.timeout,
			headers: config.headers,
		}

		this.httpClient = new HttpClient(httpConfig)

		if (config.onAuthError) {
			this.httpClient.setAuthErrorCallback(config.onAuthError)
		}

		this.auth = new AuthService(this.httpClient)
		this.sso = new SSOService(this.httpClient)
		this.users = new UsersService(this.httpClient)
		this.sessions = new SessionsService(this.httpClient)
		this.permissions = new PermissionsService(this.httpClient)
		this.permissionGroups = new PermissionGroupsService(this.httpClient)
		this.userPermissions = new UserPermissionsService(this.httpClient)
	}

	setAuthErrorCallback(callback: () => void) {
		this.httpClient.setAuthErrorCallback(callback)
	}

	setAuth(token: string, refreshToken: string, workspaceId: string) {
		this.httpClient.setAuth(token, refreshToken, workspaceId)
	}

	clearAuth() {
		this.httpClient.clearAuth()
	}

	getAuthTokens() {
		return this.httpClient.getAuthTokens()
	}

	getWorkspaceId() {
		return this.httpClient.getWorkspaceId()
	}
}
