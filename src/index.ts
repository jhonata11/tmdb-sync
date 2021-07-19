import { users } from './config'
import * as importer from './importer'
import * as exporter from './exporter'

enum RunMode {
  IMPORT,
  EXPORT
}

async function start(users: string[], mode: RunMode) {
  for (const user of users) {
    if(runMode === RunMode.EXPORT) {
      await exporter.exportMovies(user)
    }
    if(runMode === RunMode.IMPORT) {
      await importer.importMovies(user)
    }
  }
}

const [exe, file, arg] = process.argv
const runMode = arg === '-e' ? RunMode.EXPORT : RunMode.IMPORT
start(users, runMode)
