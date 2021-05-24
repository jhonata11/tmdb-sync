import { FeedItem } from './letterboxd'
import * as letterboxd from './letterboxd'
import * as tmdb from './tmdb'
import { getConfig } from './config'
import { createObjectCsvWriter } from 'csv-writer'

export async function exportMovies(user: string) {
  console.log(`============ Starting ${user} ============`)
  const config = getConfig(user)
  const client = await tmdb.init(config)
  const letterboxdMovies: FeedItem[] = await letterboxd.getFeed(
    config.letterboxdUsername
  )

  const allMovies = await client.getAllWatchedMovies()
  const allMoviesDetailed = allMovies
    .map((movie: any) => {
      const letterboxdMovie = letterboxdMovies.find((el) => {
        return el.title === movie.title
      })

      return {
        title: movie.title,
        year: movie.release_date.split('-')[0],
        rating: movie.rating,
        runtime: movie.runtime,
        director: movie.credits.crew
          .filter((el: any) => el.job === 'Director')
          .map((el: any) => el.name)
          .join(' | '),
        watchedDate: letterboxdMovie?.watchedDate,
      }
    })
    .reverse()

  const csvWriter = createObjectCsvWriter({
    path: `${user}-out.csv`,
    header: [
      { id: 'title', title: 'FILME' },
      { id: 'director', title: 'DIRETOR' },
      { id: 'year', title: 'ANO' },
      { id: 'rating', title: 'NOTA' },
      { id: 'watchedDate', title: 'VISTO' },
      { id: 'runtime', title: 'DURACAO' },
    ],
  })

  await csvWriter.writeRecords(allMoviesDetailed)
  console.log(`============= Finish ${user} =============`)
}
