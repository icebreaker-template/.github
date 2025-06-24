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
    else if (/vue/.test(cur.name)) {
      acc.vue = [...(acc.vue || []), cur]
    }

    return acc
  }, {})

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
    generateFragment('uni-app'),
    '',
    generateFragment('taro'),
    '',
    generateFragment('vue'),

  ].join('\n')
  await fs.writeFile(
    path.resolve(import.meta.dirname, './profile/README.md'),
    data,
    'utf8',
  )
}

main()
