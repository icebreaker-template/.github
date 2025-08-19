import fs from 'fs-extra'
import path from 'pathe'
import { generate } from './markdown'

async function main() {
  const readme = await generate()
  await fs.writeFile(
    path.resolve(import.meta.dirname, '../profile/README.md'),
    readme,
    'utf8',
  )
}

main()
