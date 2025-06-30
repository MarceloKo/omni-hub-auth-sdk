export interface SSOAuthorizationParams {
	client_id: string
	redirect_uri: string
	response_type?: string
	scope?: string
	state?: string
}

export interface SSOTokenRequest {
	grant_type: 'authorization_code'
	client_id: string
	client_secret: string
	code: string
	redirect_uri: string
}

export interface SSOTokenResponse {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
}

export interface SSOAuthenticateRequest {
	email: string
	password: string
	authorization_code: string
}

export interface SSOAuthenticateResponse {
	redirect_url: string
	success: boolean
}

export interface SSOIntegration {
	id: string
	name: string
	client_id: string
	login_theme: string | null
	redirect_uris: string[]
	allowed_cors_origins: string[]
}
