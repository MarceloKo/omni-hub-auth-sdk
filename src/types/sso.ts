export interface SSOAuthParams {
	client_id: string
	redirect_uri: string
	response_type?: 'code'
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
	refresh_token?: string
	scope?: string
}

export interface SSOAuthenticateRequest {
	email: string
	password: string
	authorization_code: string
}

export interface SSOIntegrationInfo {
	client_id: string
	name: string
	description?: string
	logo_url?: string
	redirect_uris: string[]
}
