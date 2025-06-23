export interface CreatePermissionRequest {
	name: string
	description?: string
}

export interface UpdatePermissionRequest {
	name?: string
	description?: string
}

export interface GetPermissionsParams extends Record<string, unknown> {
	page?: number
	limit?: number
	name?: string
	description?: string
}

export interface PermissionEntity {
	id: string
	name: string
	description?: string
	workspace_id: string
	created_at: string
	updated_at: string
}

export interface PermissionsListResponse {
	permissions: PermissionEntity[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface PermissionResponse {
	permission: PermissionEntity
	message?: string
}

export interface PermissionsReportResponse {
	total_created: number
	total_in_use: number
	total_unused: number
}
