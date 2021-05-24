import { Authenticator } from './authenticator'
import { MovieClient } from './movieClient'
import { Config, tmdbApiKey } from '../config'
import axiosInstance from './axiosInstance'

const instance = axiosInstance(tmdbApiKey)
export const init = async (config: Config) => {
  const authenticator = new Authenticator(
    instance,
    config.tmdbUsername,
    config.tmdbPassword
  )
  const auth = await authenticator.createNewSession()
  return new MovieClient(instance, auth)
}
