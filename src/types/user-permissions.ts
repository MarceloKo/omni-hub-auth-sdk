export interface AssignPermissionRequest {
	user_id: string
	permission_id: string
}

export interface RemovePermissionRequest {
	user_id: string
	permission_id: string
}

export interface BulkAssignPermissionsRequest {
	user_id: string
	permission_ids: string[]
}

export interface BulkRemovePermissionsRequest {
	user_id: string
	permission_ids: string[]
}

export interface UserPermission {
	id: string
	name: string
	description: string | null
	created_at: string
}

export interface ListUserPermissionsQueryParams extends Record<string, string | number | boolean | undefined> {
	page?: number
	limit?: number
}

export interface ListUserPermissionsResponse {
	response: UserPermission[]
	pagination: {
		page: number
		limit: number
		total: number
		total_pages: number
	}
}


