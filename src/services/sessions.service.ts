import type { HttpClient } from '../core/http-client'
import type { Session, TerminateSessionsResponse } from '../types/sessions'

export class SessionsService {
	constructor(private httpClient: HttpClient) {}

	async getSessions(): Promise<Session[]> {
		return this.httpClient.get<Session[]>('/v1/authenticate/sessions/')
	}

	async terminateSession(sessionId: string): Promise<void> {
		return this.httpClient.delete<void>(`/v1/authenticate/sessions/${sessionId}`)
	}

	async terminateOtherSessions(): Promise<TerminateSessionsResponse> {
		return this.httpClient.delete<TerminateSessionsResponse>('/v1/authenticate/sessions/terminate-others/')
	}

	async terminateAllSessions(): Promise<TerminateSessionsResponse> {
		return this.httpClient.delete<TerminateSessionsResponse>('/v1/authenticate/sessions/terminate-all/')
	}
}
