import path from 'pathe'
import simpleGit from 'simple-git'

export async function clone() {
  const baseDir = path.resolve(import.meta.dirname, '..')

  const git = simpleGit(baseDir)

  await git.subModule
}

clone()
