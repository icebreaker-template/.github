import axios from 'axios'
import fs from 'fs-extra'
import path from 'pathe'

interface Repo {
  name: string
  full_name: string
  archived: boolean
  created_at: string
  description: string
  disabled: boolean
  downloads_url: string
  forks_count: number
  is_template: boolean
  language: string
  stargazers_count: number
  html_url: string
  pushed_at: string
  updated_at: string
}
function getRepos() {
  return axios.get<Repo[]>('https://api.github.com/orgs/icebreaker-template/repos?per_page=100')
}

async function main() {
  const res = await getRepos()

  const map = res.data.reduce<Record<string, Repo[]>>((acc, cur) => {
    if (cur.archived) {
      return acc
    }
    if (/uni-app/.test(cur.name)) {
      acc['uni-app'] = [...(acc['uni-app'] || []), cur]
    }
    else if (/taro/.test(cur.name)) {
      acc.taro = [...(acc.taro || []), cur]
    }
    else if (/weapp-vite/.test(cur.name)) {
      acc['weapp-vite'] = [...(acc['weapp-vite'] || []), cur]
    }
    else if (/mpx/.test(cur.name)) {
      acc.mpx = [...(acc.mpx || []), cur]
    }
    else if (/native/.test(cur.name) && /weapp/.test(cur.name)) {
      acc['native-weapp'] = [...(acc['native-weapp'] || []), cur]
    }
    else if (/vue-mini/.test(cur.name)) {
      acc['vue-mini'] = [...(acc['vue-mini'] || []), cur]
    }
    else if (/vue/.test(cur.name)) {
      acc.vue = [...(acc.vue || []), cur]
    }
    else if (/react/.test(cur.name)) {
      acc.react = [...(acc.react || []), cur]
    }
    else {
      console.log(cur.name)
    }

    return acc
  }, {})

  console.log(res.data.length, Object.values(map).reduce((acc, cur) => acc + cur.length, 0))

  function generateFragment(key: string) {
    if (Array.isArray(map[key])) {
      return [
        `## ${key}`,
        '',
        ...map[key].map((x) => {
          return `- [${x.name}](${x.html_url}) ${x.description ?? ''}`
        }),
      ].join('\n')
    }
  }

  const data = [
    '# icebreaker 的模板集中营',
    '',
    Object.keys(map).reduce((acc, key) => {
      const fragment = generateFragment(key)
      if (fragment) {
        acc.push(fragment)
        acc.push('')
      }
      return acc
    }, [] as string[]).join('\n'),
  ].join('\n')
  await fs.writeFile(
    path.resolve(import.meta.dirname, './profile/README.md'),
    data,
    'utf8',
  )
}

main()
