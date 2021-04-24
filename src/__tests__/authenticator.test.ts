import axios, { AxiosStatic } from 'axios'
import { Authenticator } from '../tmdb/authenticator'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<AxiosStatic>

describe('authenticator.ts', () => {
  const auth = new Authenticator(mockedAxios, 'username', 'password')
  test('it should call correct url', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { request_token: 'first token' },
      })
    )
    mockedAxios.post.mockImplementationOnce((token) =>
      Promise.resolve({
        data: { request_token: 'second token' },
      })
    )
    mockedAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { session_id: 'session id' },
      })
    )
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { id: 'user_id' },
      })
    )

    const session = await auth.createNewSession()
    expect(session).toEqual({ sessionId: 'session id', userId: 'user_id' })

    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      1,
      '/authentication/token/new'
    )
    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      1,
      '/authentication/token/validate_with_login',
      {
        request_token: 'first token',
        username: 'username',
        password: 'password',
      }
    )
    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      2,
      '/authentication/session/new',
      {
        request_token: 'second token',
      }
    )
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      2,
      '/account?session_id=session id'
    )
  })
})
