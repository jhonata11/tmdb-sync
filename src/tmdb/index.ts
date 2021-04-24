import { Authenticator } from './authenticator'
import { MovieClient } from './movieClient'
import { Config } from '../config'
import axiosInstance from './axiosInstance'

export const init = async (config: Config) => {
  const instance = axiosInstance(config)
  const authenticator = new Authenticator(
    instance,
    config.tmdbUsername,
    config.tmdbPassword
  )
  const auth = await authenticator.createNewSession()
  return new MovieClient(instance, auth)
}
