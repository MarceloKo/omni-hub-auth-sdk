export interface Session {
	id: string
	token: string
	created_at: string
	expires_at: string
	updated_at: string
	is_current: boolean
	user: {
		id: string
		email: string
		name: string | null
		is_locked: boolean
		last_login_at: string | null
		created_at: string
		user_type: string[]
	}
	integration_type: string
	integration: {
		type: string
		name: string
	} | null
}

export interface SessionsListResponse {
	sessions: Session[]
	message: string
}

export interface TerminateSessionsResponse {
	sessions_terminated: number
}
