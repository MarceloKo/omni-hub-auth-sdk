export interface Customer {
	id: string
	name: string
	email: string
	phone: string | null
	cpf: string
	rg: string | null
	lastTransaction: Date | null
	createdAt: Date
	updatedAt: Date
	clientId: string
}

export interface CreateCustomerRequest {
	name: string
	email: string
	phone?: string
	cpf: string
	rg?: string
}

export interface UpdateCustomerRequest {
	name?: string
	email?: string
	phone?: string
	cpf?: string
	rg?: string
}

export interface CustomerFilters {
	name?: string
	email?: string
	cpf?: string
	page?: number
	limit?: number
}

export interface CustomerStatistics {
	total: number
	total_last_month: number
	active: number
	recent_customers: Array<{
		id: string
		name: string
		email: string
		created_at: string
	}>
	top_customers: Array<{
		id: string
		name: string
		email: string
		transaction_count: number
		last_transaction: string | null
	}>
}
