import type { HttpClient } from '../core/http-client'
import type { PaginatedResponse } from '../types/api'
import type { CreateCustomerRequest, Customer, CustomerFilters, CustomerStatistics, UpdateCustomerRequest } from '../types/customers'

export class CustomersService {
	constructor(private httpClient: HttpClient) {}

	async getAll(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
		const params: Record<string, unknown> = {}

		if (filters) {
			if (filters.name) params.name = filters.name
			if (filters.email) params.email = filters.email
			if (filters.cpf) params.cpf = filters.cpf
			if (filters.page) params.page = filters.page
			if (filters.limit) params.limit = filters.limit
		}

		return this.httpClient.get<PaginatedResponse<Customer>>('/v1/customers', { params })
	}

	async getById(id: string): Promise<Customer> {
		return this.httpClient.get<Customer>(`/v1/customers/${id}`)
	}

	async create(data: CreateCustomerRequest): Promise<Customer> {
		return this.httpClient.post<Customer>('/v1/customers', data)
	}

	async update(id: string, data: UpdateCustomerRequest): Promise<Customer> {
		return this.httpClient.put<Customer>(`/v1/customers/${id}`, data)
	}

	async delete(id: string): Promise<{ message: string }> {
		return this.httpClient.delete<{ message: string }>(`/v1/customers/${id}`)
	}

	async getStatistics(): Promise<CustomerStatistics> {
		return this.httpClient.get<CustomerStatistics>('/v1/customers/statistics')
	}

	async search(query: string, limit = 10): Promise<Customer[]> {
		return this.httpClient.get<Customer[]>('/v1/customers/search', {
			params: { q: query, limit },
		})
	}

	async exportData(format: 'csv' | 'xlsx' | 'json' = 'csv', filters?: CustomerFilters): Promise<Blob> {
		const params: Record<string, unknown> = { format }

		if (filters) {
			if (filters.name) params.name = filters.name
			if (filters.email) params.email = filters.email
			if (filters.cpf) params.cpf = filters.cpf
		}

		return this.httpClient.downloadFile('/v1/customers/export', params)
	}
}
