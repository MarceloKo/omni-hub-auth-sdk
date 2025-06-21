import axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { type ApiErrorResponse, type ApiResponse, type AuthTokens, type HttpClientConfig, type RequestConfig, isApiError } from '../types/api'

export class HttpClient {
	private client: AxiosInstance
	private token: string | null = null
	private refreshToken: string | null = null
	private workspaceId: string | null = null
	private isRefreshing = false
	private failedQueue: Array<{
		resolve: (value?: unknown) => void
		reject: (reason?: unknown) => void
	}> = []
	private refreshTimer: NodeJS.Timeout | null = null
	private onAuthError?: () => void

	constructor(config: HttpClientConfig) {
		this.client = axios.create({
			baseURL: config.baseURL,
			timeout: config.timeout || 10000,
			headers: {
				'Content-Type': 'application/json',
				...config.headers,
			},
		})

		this.setupInterceptors()
	}

	setAuthErrorCallback(callback: () => void) {
		this.onAuthError = callback
	}

	private setupInterceptors() {
		this.client.interceptors.request.use(
			async config => {
				if (this.token && this.refreshToken && !this.isRefreshing) {
					if (this.isTokenExpiringSoon(this.token)) {
						await this.proactiveTokenRefresh()
					}
				}

				if (this.token) {
					config.headers.Authorization = `Bearer ${this.token}`
				}

				if (this.workspaceId) {
					config.headers['x-workspace-id'] = this.workspaceId
				}

				return config
			},
			error => Promise.reject(error)
		)

		this.client.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

				if (error.response) {
					const status = error.response.status

					if (status === 401 && !originalRequest._retry) {
						if (this.isRefreshing) {
							return new Promise((resolve, reject) => {
								this.failedQueue.push({ resolve, reject })
							})
								.then(token => {
									if (originalRequest.headers) {
										originalRequest.headers.Authorization = `Bearer ${token}`
									}
									return this.client(originalRequest)
								})
								.catch(err => Promise.reject(err))
						}

						originalRequest._retry = true
						this.isRefreshing = true

						if (this.refreshToken) {
							try {
								const newTokens = await this.refreshTokens()
								this.setAuth(newTokens.token, newTokens.refreshToken, this.workspaceId || '')
								this.processQueue(newTokens.token, null)
								if (originalRequest.headers) {
									originalRequest.headers.Authorization = `Bearer ${newTokens.token}`
								}
								return this.client(originalRequest)
							} catch (refreshError) {
								this.processQueue(null, refreshError)
								this.clearAuth()
								this.onAuthError?.()
								return Promise.reject(refreshError)
							} finally {
								this.isRefreshing = false
							}
						} else {
							this.clearAuth()
							this.onAuthError?.()
						}
					}
				}

				return Promise.reject(error)
			}
		)
	}

	setAuth(token: string, refreshToken: string, workspaceId: string) {
		this.token = token
		this.refreshToken = refreshToken
		this.workspaceId = workspaceId
		this.setupTokenRefreshTimer()
	}

	clearAuth() {
		this.token = null
		this.refreshToken = null
		this.workspaceId = null

		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer)
			this.refreshTimer = null
		}
	}

	getAuthTokens(): AuthTokens | null {
		if (this.token && this.refreshToken) {
			return {
				token: this.token,
				refreshToken: this.refreshToken,
			}
		}
		return null
	}

	getWorkspaceId(): string | null {
		return this.workspaceId
	}

	getBaseURL(): string {
		return this.client.defaults.baseURL || ''
	}

	async get<T>(url: string, config?: RequestConfig): Promise<T> {
		try {
			const response = await this.client.get<ApiResponse<T>>(url, {
				params: config?.params,
				headers: config?.headers,
				timeout: config?.timeout,
			})
			return this.handleResponse<T>(response.data)
		} catch (error) {
			throw this.handleError(error)
		}
	}

	async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
		try {
			const response = await this.client.post<ApiResponse<T>>(url, data, {
				headers: config?.headers,
				timeout: config?.timeout,
			})
			return this.handleResponse<T>(response.data)
		} catch (error) {
			throw this.handleError(error)
		}
	}

	async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
		try {
			const response = await this.client.put<ApiResponse<T>>(url, data, {
				headers: config?.headers,
				timeout: config?.timeout,
			})
			return this.handleResponse<T>(response.data)
		} catch (error) {
			throw this.handleError(error)
		}
	}

	async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
		try {
			const response = await this.client.patch<ApiResponse<T>>(url, data, {
				headers: config?.headers,
				timeout: config?.timeout,
			})
			return this.handleResponse<T>(response.data)
		} catch (error) {
			throw this.handleError(error)
		}
	}

	async delete<T>(url: string, config?: RequestConfig): Promise<T> {
		try {
			const response = await this.client.delete<ApiResponse<T>>(url, {
				headers: config?.headers,
				timeout: config?.timeout,
				data: config?.params,
			})
			return this.handleResponse<T>(response.data)
		} catch (error) {
			throw this.handleError(error)
		}
	}

	async downloadFile(url: string, params?: Record<string, unknown>): Promise<Blob> {
		try {
			const response = await this.client.get(url, {
				params,
				responseType: 'blob',
			})
			return response.data
		} catch (error) {
			throw this.handleError(error)
		}
	}

	private handleResponse<T>(data: ApiResponse<T>): T {
		if (isApiError(data)) {
			const errorObj = {
				errors: data.errors,
				response: data.response,
			} as ApiErrorResponse
			throw errorObj
		}
		return data.response
	}

	private async refreshTokens(): Promise<{ token: string; refreshToken: string }> {
		if (!this.refreshToken) {
			throw new Error('No refresh token available')
		}

		const response = await axios.post(`${this.client.defaults.baseURL}/v1/authenticate/refresh`, {
			refreshToken: this.refreshToken,
		})

		return response.data.response
	}

	private processQueue(token: string | null, error: unknown) {
		for (const { resolve, reject } of this.failedQueue) {
			if (error) {
				reject(error)
			} else {
				resolve(token)
			}
		}
		this.failedQueue = []
	}

	private isTokenExpiringSoon(token: string, bufferMinutes = 5): boolean {
		try {
			const decoded = jwtDecode<{ exp: number }>(token)
			const currentTime = Date.now() / 1000
			const expirationTime = decoded.exp
			const timeUntilExpiry = expirationTime - currentTime
			const bufferSeconds = bufferMinutes * 60

			return timeUntilExpiry <= bufferSeconds
		} catch (_error) {
			return true
		}
	}

	private setupTokenRefreshTimer() {
		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer)
		}

		if (!this.token) {
			return
		}

		try {
			const decoded = jwtDecode<{ exp: number }>(this.token)
			const currentTime = Date.now() / 1000
			const expirationTime = decoded.exp

			const refreshTime = (expirationTime - currentTime - 300) * 1000

			if (refreshTime > 0) {
				this.refreshTimer = setTimeout(async () => {
					await this.proactiveTokenRefresh()
				}, refreshTime)
			} else {
				this.proactiveTokenRefresh()
			}
		} catch (_error) {
			// Silent fail for token decoding errors
		}
	}

	private async proactiveTokenRefresh() {
		if (!this.refreshToken || this.isRefreshing) {
			return
		}

		try {
			this.isRefreshing = true
			const newTokens = await this.refreshTokens()
			this.token = newTokens.token
			this.refreshToken = newTokens.refreshToken
			this.setupTokenRefreshTimer()
		} catch (_error) {
			this.clearAuth()
			this.onAuthError?.()
		} finally {
			this.isRefreshing = false
		}
	}

	private handleError(error: unknown): ApiErrorResponse | Error {
		if (axios.isAxiosError(error)) {
			if (error.response?.data) {
				const responseData = error.response.data
				if (responseData.errors && Array.isArray(responseData.errors)) {
					return {
						errors: responseData.errors,
						response: responseData.response || null,
					} as ApiErrorResponse
				}

				if (responseData.message) {
					return {
						errors: [responseData.message],
						response: null,
					} as ApiErrorResponse
				}
			}

			if (error.message) {
				return {
					errors: [error.message],
					response: null,
				} as ApiErrorResponse
			}
		}

		return {
			errors: ['Ocorreu um erro inesperado. Tente novamente.'],
			response: null,
		} as ApiErrorResponse
	}
}
