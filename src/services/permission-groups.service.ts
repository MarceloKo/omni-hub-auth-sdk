import type { HttpClient } from '../core/http-client'
import type { CreatePermissionGroupRequest, GetPermissionGroupsParams, PermissionGroupResponse, PermissionGroupsListResponse, UpdatePermissionGroupRequest } from '../types/permission-groups'

export class PermissionGroupsService {
	constructor(private httpClient: HttpClient) {}

	async createPermissionGroup(data: CreatePermissionGroupRequest): Promise<PermissionGroupResponse> {
		return this.httpClient.post<PermissionGroupResponse>('/v1/permissions-group/', data)
	}

	async getPermissionGroups(params?: GetPermissionGroupsParams): Promise<PermissionGroupsListResponse> {
		return this.httpClient.get<PermissionGroupsListResponse>('/v1/permissions-group/', { params })
	}

	async updatePermissionGroup(id: string, data: UpdatePermissionGroupRequest): Promise<PermissionGroupResponse> {
		return this.httpClient.put<PermissionGroupResponse>(`/v1/permissions-group/${id}`, data)
	}

	async deletePermissionGroup(id: string): Promise<{ message: string }> {
		return this.httpClient.delete<{ message: string }>(`/v1/permissions-group/${id}`)
	}
}
