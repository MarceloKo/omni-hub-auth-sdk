import type { HttpClient } from '../core/http-client'
import type { CreatePermissionRequest, GetPermissionsParams, PermissionResponse, PermissionsListResponse, PermissionsReportResponse, UpdatePermissionRequest } from '../types/permissions'

export class PermissionsService {
	constructor(private httpClient: HttpClient) {}

	async createPermission(data: CreatePermissionRequest): Promise<PermissionResponse> {
		return this.httpClient.post<PermissionResponse>('/v1/permissions/', data)
	}

	async getPermissions(params?: GetPermissionsParams): Promise<PermissionsListResponse> {
		return this.httpClient.get<PermissionsListResponse>('/v1/permissions/', { params })
	}

	async getPermissionsReport(): Promise<PermissionsReportResponse> {
		return this.httpClient.get<PermissionsReportResponse>('/v1/permissions/report')
	}

	async updatePermission(id: string, data: UpdatePermissionRequest): Promise<PermissionResponse> {
		return this.httpClient.put<PermissionResponse>(`/v1/permissions/${id}`, data)
	}

	async deletePermission(id: string): Promise<{ message: string }> {
		return this.httpClient.delete<{ message: string }>(`/v1/permissions/${id}`)
	}
}
