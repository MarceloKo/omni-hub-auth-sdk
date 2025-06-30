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

export interface PermissionGroup {
	id: string
	name: string
	description: string | null
	workspace_id: string
	created_at: string
	updated_at: string
	permissions: Permission[]
	users_count: number
}

export interface ListPermissionGroupsQueryParams extends Record<string, string | number | boolean | undefined> {
	page?: number
	limit?: number
	name?: string
	description?: string
}

export interface ListPermissionGroupsResponse {
	response: PermissionGroup[]
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
