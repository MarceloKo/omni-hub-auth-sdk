export interface Session {
	id: string
	user_id: string
	workspace_id: string
	user_agent?: string
	ip_address?: string
	created_at: string
	last_activity_at: string
	expires_at: string
	is_current?: boolean
}

export interface SessionsListResponse {
	sessions: Session[]
	message: string
}

export interface TerminateSessionResponse {
	message: string
}
