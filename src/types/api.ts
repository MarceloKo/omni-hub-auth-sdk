export interface ApiSuccessResponse<T> {
	message: string
	response: T
}

export interface ApiErrorResponse {
	response: null
	errors: string[]
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
	return 'response' in response && !('errors' in response)
}

export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
	return 'errors' in response
}

export interface PaginatedResponse<T> {
	response: T[]
	pagination: {
		page: number
		limit: number
		total: number
		total_pages: number
	}
}

export interface HttpClientConfig {
	baseURL: string
	timeout?: number
	headers?: Record<string, string>
}

export interface AuthTokens {
	token: string
	refreshToken: string
}

export interface RequestConfig {
	headers?: Record<string, string>
	params?: Record<string, unknown> | Record<string, string | number | boolean | undefined>
	timeout?: number
}
