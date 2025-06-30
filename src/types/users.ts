export interface CreateUserRequest {
	email: string
	password?: string
	name: string
	permission_group_id?: string
	attributes?: Record<string, unknown>
}

export interface UpdateUserRequest {
	name?: string
	permission_group_id?: string
	attributes?: Record<string, unknown> | null
}

export interface UpdateUserStatusRequest {
	action: 'block' | 'unblock'
}

export interface ManageUserPermissionGroupRequest {
	permission_group_id: string | null
	action: 'assign' | 'remove'
}

export interface User {
	id: string
	email: string
	name: string | null
	is_locked: boolean
	email_verified: boolean
	last_login_at: string | null
	created_at: string
	user_type: string[]
	permissions: Permission[]
	permission_group: {
		id: string
		name: string
	} | null
	attributes: Record<string, unknown>
}

export interface UserDetail {
	id: string
	email: string
	name: string | null
	is_locked: boolean
	email_verified: boolean
	last_login_at: string | null
	created_at: string
	user_type: string[]
	permissions: Permission[]
	attributes: Record<string, unknown>
}

export interface CreateUserResponse {
	id: string
	email: string
	name: string | null
	email_verified: boolean
	last_login_at: string | null
	locked_at: string | null
	is_locked: boolean
	created_at: string
	updated_at: string
}

export interface ListUsersQueryParams extends Record<string, string | number | boolean | undefined> {
	page?: number
	limit?: number
	name?: string
	email?: string
	is_locked?: boolean
}

export interface ListUsersResponse {
	users: User[]
	pagination: {
		page: number
		limit: number
		total: number
		total_pages: number
	}
}

export interface Permission {
	id: string
	name: string
	description: string | null
}
