import axios, { AxiosInstance } from 'axios'
import { Config } from '../config'

export default (config: Config) => {
  const instance: AxiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
      api_key: config.tmdbApiKey,
    },
  })
  return instance
}
