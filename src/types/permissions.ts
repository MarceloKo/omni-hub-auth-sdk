export interface CreatePermissionRequest {
	name: string
	description?: string
}

export interface UpdatePermissionRequest {
	name?: string
	description?: string
}

export interface Permission {
	id: string
	name: string
	description: string | null
	workspace_id: string
	created_at: string
	updated_at: string
}

export interface ListPermissionsQueryParams extends Record<string, string | number | boolean | undefined> {
	page?: number
	limit?: number
	name?: string
	description?: string
}

export interface ListPermissionsResponse {
	response: Permission[]
	pagination: {
		page: number
		limit: number
		total: number
		total_pages: number
	}
}

export interface PermissionsReport {
	total_permissions: number
	permissions_in_use: number
	permissions_not_used: number
}
