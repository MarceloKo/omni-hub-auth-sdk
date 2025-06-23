import type { HttpClient } from '../core/http-client'
import type {
	CreateUserRequest,
	CreateUserResponse,
	GetUsersParams,
	ManageUserPermissionGroupRequest,
	UpdateUserRequest,
	UpdateUserStatusRequest,
	UserResponse,
	UsersListResponse,
} from '../types/users'

export class UsersService {
	constructor(private httpClient: HttpClient) {}

	async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
		return this.httpClient.post<CreateUserResponse>('/v1/users/create-user/', data)
	}

	async getUsers(params?: GetUsersParams): Promise<UsersListResponse> {
		return this.httpClient.get<UsersListResponse>('/v1/users/', { params })
	}

	async getUserById(id: string): Promise<UserResponse> {
		return this.httpClient.get<UserResponse>(`/v1/users/${id}`)
	}

	async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
		return this.httpClient.patch<UserResponse>(`/v1/users/${id}`, data)
	}

	async updateUserStatus(id: string, data: UpdateUserStatusRequest): Promise<{ message: string }> {
		return this.httpClient.patch<{ message: string }>(`/v1/users/${id}/status`, data)
	}

	async manageUserPermissionGroup(id: string, data: ManageUserPermissionGroupRequest): Promise<{ message: string }> {
		return this.httpClient.patch<{ message: string }>(`/v1/users/${id}/permission-group`, data)
	}
}
