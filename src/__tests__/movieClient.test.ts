import axios, { AxiosStatic } from 'axios'
import { MovieClient } from '../tmdb/movieClient'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<AxiosStatic>

describe('authenticator.ts', () => {
  const client = new MovieClient(mockedAxios, {
    sessionId: 'session_id',
    userId: '12345',
  })
  test('getLastWatchedMovie should call correct url', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { results: [] },
      })
    )

    await client.getLastWatchedMovie()
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/account/12345/rated/movies?session_id=session_id&sort_by=created_at.desc&page=1`
    )
  })

  test('rateMovie should call correct url', async () => {
    mockedAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { status_message: 'success' },
      })
    )

    await client.rateMovie(1, 2)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/movie/1/rating?session_id=session_id`,
      {
        value: 2,
      }
    )
  })

  test('`searchMovie` should call correct url', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { results: [] },
      })
    )

    await client.searchMovie('Mulan', 1995)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/search/movie?query=Mulan&year=1995`
    )
  })
})
