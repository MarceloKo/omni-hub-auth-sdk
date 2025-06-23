import type { HttpClient } from '../core/http-client'
import type { SessionsListResponse, TerminateSessionResponse } from '../types/sessions'

export class SessionsService {
	constructor(private httpClient: HttpClient) {}

	async getSessions(): Promise<SessionsListResponse> {
		return this.httpClient.get<SessionsListResponse>('/v1/authenticate/sessions/')
	}

	async terminateSession(sessionId: string): Promise<TerminateSessionResponse> {
		return this.httpClient.delete<TerminateSessionResponse>(`/v1/authenticate/sessions/${sessionId}`)
	}

	async terminateOtherSessions(): Promise<TerminateSessionResponse> {
		return this.httpClient.delete<TerminateSessionResponse>('/v1/authenticate/sessions/terminate-others/')
	}

	async terminateAllSessions(): Promise<TerminateSessionResponse> {
		return this.httpClient.delete<TerminateSessionResponse>('/v1/authenticate/sessions/terminate-all/')
	}
}
