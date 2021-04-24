import { FeedItem } from './letterboxd'
import * as letterboxd from './letterboxd'
import * as tmdb from './tmdb'
import { config } from './config'
;(async () => {
  console.log('============ Starting ============')
  const client = await tmdb.init(config)
  const lastMovie = await client.getLastWatchedMovie()
  const letterboxdMovies: FeedItem[] = await letterboxd.getFeed(
    config.letterboxdUsername
  )
  const index = letterboxdMovies.findIndex(
    (item: FeedItem) => item.title === lastMovie.title
  )
  const newItems: FeedItem[] = letterboxdMovies.slice(0, index).reverse()
  console.log(newItems.length, 'new items to be imported')

  const movieInfo = newItems.map(async (item: FeedItem) => {
    const tmdbMovie = await client.searchMovie(item.title, item.year)
    if (!tmdbMovie) return
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      year: item.year,
      rating: item.rating,
    }
  })
  const detailedMovies = await Promise.all(movieInfo)
  console.log('Found movie details for', detailedMovies.length, 'items')

  // Ensure rating sequence
  for (const movie of detailedMovies) {
    const { id, rating, title, year } = movie as any
    const movieInfo = `${id} - ${title} (${year})`
    console.log(`${movieInfo} [Starting]`)
    const response = await client.rateMovie(id, rating)
    console.log(`${movieInfo} [${response}]`)
  }

  console.log('============= Finish =============')
})()
