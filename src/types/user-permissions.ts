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

export interface GetUserPermissionsParams extends Record<string, unknown> {
	page?: number
	limit?: number
}

export interface UserPermission {
	id: string
	user_id: string
	permission_id: string
	workspace_id: string
	assigned_at: string
	permission: {
		id: string
		name: string
		description?: string
	}
}

export interface UserPermissionsListResponse {
	user_permissions: UserPermission[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface AvailablePermission {
	id: string
	name: string
	description?: string
	workspace_id: string
}

export interface AvailablePermissionsListResponse {
	available_permissions: AvailablePermission[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface AssignPermissionResponse {
	message: string
	user_permission?: UserPermission
}

export interface RemovePermissionResponse {
	message: string
}

export interface BulkAssignPermissionsResponse {
	message: string
	assigned_permissions: UserPermission[]
}

export interface BulkRemovePermissionsResponse {
	message: string
	removed_count: number
}
