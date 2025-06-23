import type { HttpClient } from '../core/http-client'
import type {
	AssignPermissionRequest,
	AssignPermissionResponse,
	AvailablePermissionsListResponse,
	BulkAssignPermissionsRequest,
	BulkAssignPermissionsResponse,
	BulkRemovePermissionsRequest,
	BulkRemovePermissionsResponse,
	GetUserPermissionsParams,
	RemovePermissionRequest,
	RemovePermissionResponse,
	UserPermissionsListResponse,
} from '../types/user-permissions'

export class UserPermissionsService {
	constructor(private httpClient: HttpClient) {}

	async assignPermission(data: AssignPermissionRequest): Promise<AssignPermissionResponse> {
		return this.httpClient.post<AssignPermissionResponse>('/v1/user-permissions/assign', data)
	}

	async removePermission(data: RemovePermissionRequest): Promise<RemovePermissionResponse> {
		return this.httpClient.post<RemovePermissionResponse>('/v1/user-permissions/remove', data)
	}

	async getUserPermissions(userId: string, params?: GetUserPermissionsParams): Promise<UserPermissionsListResponse> {
		return this.httpClient.get<UserPermissionsListResponse>(`/v1/user-permissions/${userId}`, { params })
	}

	async getAvailablePermissions(userId: string, params?: GetUserPermissionsParams): Promise<AvailablePermissionsListResponse> {
		return this.httpClient.get<AvailablePermissionsListResponse>(`/v1/user-permissions/${userId}/available`, { params })
	}

	async bulkAssignPermissions(data: BulkAssignPermissionsRequest): Promise<BulkAssignPermissionsResponse> {
		return this.httpClient.post<BulkAssignPermissionsResponse>('/v1/user-permissions/bulk-assign', data)
	}

	async bulkRemovePermissions(data: BulkRemovePermissionsRequest): Promise<BulkRemovePermissionsResponse> {
		return this.httpClient.post<BulkRemovePermissionsResponse>('/v1/user-permissions/bulk-remove', data)
	}
}
