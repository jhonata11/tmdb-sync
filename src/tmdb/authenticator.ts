import { AxiosInstance } from 'axios'
import { Session } from './models'

export class Authenticator {
  private axiosInstance: AxiosInstance
  private username: string
  private password: string
  constructor(
    axiosInstance: AxiosInstance,
    username: string,
    password: string
  ) {
    this.axiosInstance = axiosInstance
    this.username = username
    this.password = password
  }

  private async getFirstToken(): Promise<string> {
    const res = await this.axiosInstance.get('/authentication/token/new')
    return res.data.request_token
  }

  private async authenticateWithCredentials(
    requestToken: string
  ): Promise<string> {
    const res = await this.axiosInstance.post(
      `/authentication/token/validate_with_login`,
      {
        request_token: requestToken,
        username: this.username,
        password: this.password,
      }
    )
    return res.data.request_token
  }

  private async getSessionFromToken(requestToken: string): Promise<string> {
    const res = await this.axiosInstance.post(`/authentication/session/new`, {
      request_token: requestToken,
    })
    return res.data.session_id
  }

  private async accountDetails(sessionId: string): Promise<{ id: string }> {
    const res = await this.axiosInstance.get(`/account?session_id=${sessionId}`)
    return res.data
  }

  public async createNewSession(): Promise<Session> {
    const token1 = await this.getFirstToken()
    const token2 = await this.authenticateWithCredentials(token1)
    const sessionId = await this.getSessionFromToken(token2)
    const details = await this.accountDetails(sessionId)
    return {
      sessionId,
      userId: details.id,
    }
  }
}
