import type { HttpClient } from '../core/http-client'
import type {
	CreateUserRequest,
	UpdateUserRequest,
	UpdateUserStatusRequest,
	ManageUserPermissionGroupRequest,
	CreateUserResponse,
	ListUsersQueryParams,
	ListUsersResponse,
	UserDetail,
} from '../types/users'

export class UsersService {
	constructor(private httpClient: HttpClient) { }

	async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
		return this.httpClient.post<CreateUserResponse>('/v1/users/create-user/', data)
	}

	async getUsers(params?: ListUsersQueryParams): Promise<ListUsersResponse> {
		return this.httpClient.get<ListUsersResponse>('/v1/users/', { params })
	}

	async getUserById(id: string): Promise<UserDetail> {
		return this.httpClient.get<UserDetail>(`/v1/users/${id}`)
	}

	async updateUser(id: string, data: UpdateUserRequest): Promise<void> {
		return this.httpClient.patch<void>(`/v1/users/${id}`, data)
	}

	async updateUserStatus(id: string, data: UpdateUserStatusRequest): Promise<void> {
		return this.httpClient.patch<void>(`/v1/users/${id}/status`, data)
	}

	async manageUserPermissionGroup(id: string, data: ManageUserPermissionGroupRequest): Promise<void> {
		return this.httpClient.patch<void>(`/v1/users/${id}/permission-group`, data)
	}
}
