import type { HttpClient } from '../core/http-client'
import type { CreatePermissionRequest, ListPermissionsQueryParams, ListPermissionsResponse, Permission, PermissionsReport, UpdatePermissionRequest } from '../types/permissions'

export class PermissionsService {
	constructor(private httpClient: HttpClient) {}

	async createPermission(data: CreatePermissionRequest): Promise<Permission> {
		return this.httpClient.post<Permission>('/v1/permissions/', data)
	}

	async getPermissions(params?: ListPermissionsQueryParams): Promise<ListPermissionsResponse> {
		return this.httpClient.get<ListPermissionsResponse>('/v1/permissions/', { params })
	}

	async getPermissionsReport(): Promise<PermissionsReport> {
		return this.httpClient.get<PermissionsReport>('/v1/permissions/report')
	}

	async updatePermission(id: string, data: UpdatePermissionRequest): Promise<Permission> {
		return this.httpClient.put<Permission>(`/v1/permissions/${id}`, data)
	}

	async deletePermission(id: string): Promise<void> {
		return this.httpClient.delete<void>(`/v1/permissions/${id}`)
	}
}
