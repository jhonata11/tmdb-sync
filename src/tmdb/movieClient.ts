import { AxiosInstance } from 'axios'
import { Session } from './models'

export class MovieClient {
  private axiosInstance: AxiosInstance
  private sessionId: string
  private userId: string
  constructor(axiosInstance: AxiosInstance, authInstance: Session) {
    this.axiosInstance = axiosInstance
    this.sessionId = authInstance.sessionId
    this.userId = authInstance.userId
  }
  async getLastWatchedMovie() {
    const res = await this.axiosInstance.get(
      `/account/${this.userId}/rated/movies?session_id=${this.sessionId}&sort_by=created_at.desc&page=1`
    )
    return res.data?.results?.[0]
  }

  async getAllWatchedMovies(currentPage: number = 1): Promise<any> {
    const res = await this.axiosInstance.get(
      `/account/${this.userId}/rated/movies?session_id=${this.sessionId}&sort_by=created_at.desc&page=${currentPage}`
    )
    const { results, total_pages } = res.data
    const finalResponse = await Promise.all(
      results.map(async (el: any) => {
        const detail = await this.getMovieById(el.id)
        // detail.rating = el.rating
        return { ...detail, rating: el.rating / 2 }
      })
    )
    if (currentPage === total_pages) {
      return finalResponse
    }
    return [
      ...finalResponse,
      ...(await this.getAllWatchedMovies(currentPage + 1)),
    ]
  }

  async getMovieById(id: number) {
    const res = await this.axiosInstance.get(
      `/movie/${id}?append_to_response=credits`
    )
    return res.data
  }

  async rateMovie(movieId: number, rating: number) {
    const res = await this.axiosInstance.post(
      `/movie/${movieId}/rating?session_id=${this.sessionId}`,
      {
        value: rating,
      }
    )
    return res.data.status_message
  }

  async searchMovie(title: string, year: number) {
    const encodedTitle = encodeURIComponent(title)
    const res = await this.axiosInstance.get(
      `/search/movie?query=${encodedTitle}&year=${year}`
    )
    const movie = res.data?.results?.[0]
    return movie?.title === title ? movie : null
  }
}
