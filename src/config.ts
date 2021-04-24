import dotenv from 'dotenv'
dotenv.config()

export const config = {
  tmdbUsername: process.env.TMDB_USERNAME || '',
  tmdbPassword: process.env.TMBD_PASSWORD || '',
  tmdbApiKey: process.env.TMDB_API_KEY || '',
  letterboxdUsername: process.env.LETTERBOXD_USERNAME || '',
}

export type Config = typeof config
