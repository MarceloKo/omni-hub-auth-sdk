import type { HttpClient } from '../core/http-client'
import type {
	AssignPermissionRequest,
	BulkAssignPermissionsRequest,
	BulkRemovePermissionsRequest,
	ListUserPermissionsQueryParams,
	ListUserPermissionsResponse,
	RemovePermissionRequest,
} from '../types/user-permissions'

export class UserPermissionsService {
	constructor(private httpClient: HttpClient) {}

	async assignPermission(data: AssignPermissionRequest): Promise<void> {
		return this.httpClient.post<void>('/v1/user-permissions/assign', data)
	}

	async removePermission(data: RemovePermissionRequest): Promise<void> {
		return this.httpClient.post<void>('/v1/user-permissions/remove', data)
	}

	async bulkAssignPermissions(data: BulkAssignPermissionsRequest): Promise<void> {
		return this.httpClient.post<void>('/v1/user-permissions/bulk-assign', data)
	}

	async bulkRemovePermissions(data: BulkRemovePermissionsRequest): Promise<void> {
		return this.httpClient.post<void>('/v1/user-permissions/bulk-remove', data)
	}

	async getUserPermissions(userId: string, params?: ListUserPermissionsQueryParams): Promise<ListUserPermissionsResponse> {
		return this.httpClient.get<ListUserPermissionsResponse>(`/v1/user-permissions/${userId}`, { params })
	}

	async getAvailablePermissions(userId: string, params?: ListUserPermissionsQueryParams): Promise<ListUserPermissionsResponse> {
		return this.httpClient.get<ListUserPermissionsResponse>(`/v1/user-permissions/${userId}/available`, { params })
	}
}
