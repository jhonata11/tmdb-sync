import axios, { AxiosInstance } from 'axios'

export default (key: string) => {
  const instance: AxiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
      api_key: key,
    },
  })
  return instance
}
