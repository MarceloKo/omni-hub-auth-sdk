export interface CreatePermissionGroupRequest {
	name: string
	description?: string
	permissions_ids: string[]
	users_ids?: string[]
}

export interface UpdatePermissionGroupRequest {
	name?: string
	description?: string
	permissions_ids?: string[]
	users_ids?: string[]
}

export interface GetPermissionGroupsParams extends Record<string, unknown> {
	page?: number
	limit?: number
	name?: string
	description?: string
}

export interface PermissionGroupEntity {
	id: string
	name: string
	description?: string
	workspace_id: string
	created_at: string
	updated_at: string
	permissions?: PermissionGroupPermission[]
	users?: PermissionGroupUser[]
}

export interface PermissionGroupPermission {
	id: string
	name: string
	description?: string
	workspace_id: string
	created_at: string
	updated_at: string
}

export interface PermissionGroupUser {
	id: string
	email: string
	name: string
	is_locked: boolean
}

export interface PermissionGroupsListResponse {
	permission_groups: PermissionGroupEntity[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface PermissionGroupResponse {
	permission_group: PermissionGroupEntity
	message?: string
}
