import axios from 'axios'

export interface Repo {
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

export function getRepos() {
  return axios.get<Repo[]>('https://api.github.com/orgs/icebreaker-template/repos?per_page=100')
}

export type ReposMap = Record<string, {
  items: Repo[]
  order: number
}>
