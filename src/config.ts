import dotenv from 'dotenv'
dotenv.config()

export interface Config {
  tmdbUsername: string
  tmdbPassword: string
  letterboxdUsername: string
}

export const users = process.env.USERS?.split(',') || []

export const getConfig = (user: string) => ({
  tmdbUsername: process.env[`TMDB_USERNAME_${user.toUpperCase()}`] || '',
  tmdbPassword: process.env[`TMBD_PASSWORD_${user.toUpperCase()}`] || '',
  letterboxdUsername:
    process.env[`LETTERBOXD_USERNAME_${user.toUpperCase()}`] || '',
})

export const tmdbApiKey = process.env.TMDB_API_KEY || ''
