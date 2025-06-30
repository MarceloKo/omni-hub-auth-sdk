import type { HttpClient } from '../core/http-client'
import type { CreatePermissionGroupRequest, ListPermissionGroupsQueryParams, ListPermissionGroupsResponse, PermissionGroup, UpdatePermissionGroupRequest } from '../types/permission-groups'

export class PermissionGroupsService {
	constructor(private httpClient: HttpClient) {}

	async createPermissionGroup(data: CreatePermissionGroupRequest): Promise<PermissionGroup> {
		return this.httpClient.post<PermissionGroup>('/v1/permissions-group/', data)
	}

	async getPermissionGroups(params?: ListPermissionGroupsQueryParams): Promise<ListPermissionGroupsResponse> {
		return this.httpClient.get<ListPermissionGroupsResponse>('/v1/permissions-group/', { params })
	}

	async updatePermissionGroup(id: string, data: UpdatePermissionGroupRequest): Promise<PermissionGroup> {
		return this.httpClient.put<PermissionGroup>(`/v1/permissions-group/${id}`, data)
	}

	async deletePermissionGroup(id: string): Promise<void> {
		return this.httpClient.delete<void>(`/v1/permissions-group/${id}`)
	}
}
