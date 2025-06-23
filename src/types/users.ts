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

export interface GetUsersParams extends Record<string, unknown> {
	page?: number
	limit?: number
	name?: string
	email?: string
	is_locked?: boolean
}

export interface UserEntity {
	id: string
	email: string
	name: string
	is_locked: boolean
	email_verified: boolean
	last_login_at: string | null
	created_at: string
	updated_at: string
	user_type: string[]
	permissions?: PermissionEntity[]
	permission_group?: {
		id: string
		name: string
		description?: string
	} | null
	attributes?: Record<string, unknown>
}

export interface PermissionEntity {
	id: string
	name: string
	description?: string
	workspace_id: string
	created_at: string
	updated_at: string
}

export interface UsersListResponse {
	users: UserEntity[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface CreateUserResponse {
	user: UserEntity
	message: string
}

export interface UserResponse {
	user: UserEntity
}
