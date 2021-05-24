import { users } from './config'
import * as importer from './importer'
import * as exporter from './exporter'

async function start(users: string[]) {
  for (const user of users) {
    // await importer.importMovies(user)
    await exporter.exportMovies(user)
  }
}

start(users)
