export interface LoginRequest {
	email: string
	password: string
	integrationType?: 'API' | 'SSO' | 'PANEL'
}

export interface RefreshTokenRequest {
	refreshToken: string
}

export interface LogoutRequest {
	refreshToken: string
}

export interface Workspace {
	id: string
	name: string
	slug: string
	main: boolean
}

export interface User {
	id: string
	email: string
	name: string | null
	is_locked: boolean
	email_verified?: boolean
	last_login_at: string | null
	created_at?: string
	user_type?: string[]
	permissions?: Permission[]
	permission_group?: {
		id: string
		name: string
	} | null
	attributes?: Record<string, unknown>
}

export interface Permission {
	id: string
	name: string
	description: string | null
	workspace_id?: string
	created_at?: string
	updated_at?: string
}

export interface LoginResponse {
	token: string
	refreshToken: string
	workspaces: Workspace[]
	user: {
		id: string
		email: string
		name: string | null
		is_locked: boolean
	}
}

export interface RefreshTokenResponse {
	token: string
	refreshToken: string
}

export interface ValidateTokenResponse {
	valid: boolean
	user: {
		id: string
		email: string
		name: string | null
	} | null
}
