import type { ReposMap } from './repos'
import { getRepos } from './repos'

export async function generate() {
  const res = await getRepos()

  const map = res.data.reduce<ReposMap>((acc, cur) => {
    if (cur.archived) {
      return acc
    }
    if (/uni-app/.test(cur.name)) {
      acc['uni-app'] = {
        items: [...(acc['uni-app']?.items || []), cur],
        order: 8,
      }
    }
    else if (/taro/.test(cur.name)) {
      acc.taro = {
        items: [...(acc.taro?.items || []), cur],
        order: 7,
      }
    }
    else if (/weapp-vite/.test(cur.name)) {
      acc['weapp-vite'] = {
        items: [...(acc['weapp-vite']?.items || []), cur],
        order: 6,
      }
    }
    else if (/mpx/.test(cur.name)) {
      acc.mpx = {
        items: [...(acc.mpx?.items || []), cur],
        order: 5,
      }
    }
    else if (/native/.test(cur.name) && /weapp/.test(cur.name)) {
      acc['native-weapp'] = {
        items: [...(acc['native-weapp']?.items || []), cur],
        order: 4,
      }
    }
    else if (/vue-mini/.test(cur.name)) {
      acc['vue-mini'] = {
        items: [...(acc['vue-mini']?.items || []), cur],
        order: 3,
      }
    }
    else if (/vue/.test(cur.name)) {
      acc.vue = {
        items: [...(acc.vue?.items || []), cur],
        order: 2,
      }
    }
    else if (/react/.test(cur.name)) {
      acc.react = {
        items: [...(acc.react?.items || []), cur],
        order: 1,
      }
    }
    else {
      console.log(cur.name)
      acc.other = {
        items: [...(acc.other?.items || []), cur],
        order: 0,
      }
    }

    return acc
  }, {})

  console.log(res.data.length, Object.values(map).reduce((acc, cur) => acc + cur.items.length, 0))

  function generateFragment(key: string) {
    if (Array.isArray(map[key].items)) {
      if (key === 'uni-app') {
        const result = Object.entries(map[key].items.reduce<ReposMap>((acc, cur) => {
          if (/hbuilder/.test(cur.name)) {
            acc.hbuilderx = {
              items: [...(acc.hbuilderx?.items || []), cur],
              order: 0,
            }
          }
          else {
            acc.cli = {
              items: [...(acc.cli?.items || []), cur],
              order: 1,
            }
          }
          return acc
        }, {}))
          .sort((a, b) => b[1].order - a[1].order)
          .reduce<string[]>((acc, [key, { items }]) => {
            acc.push(`### ${key}`)
            acc.push('')
            items.forEach((x) => {
              acc.push(`- [${x.name}](${x.html_url}) ${x.description ?? ''}`)
            })
            return acc
          }, [])
        return [
          `## ${key}`,
          '',
          ...result,
        ].join('\n')
      }
      else {
        return [
          `## ${key}`,
          '',
          ...map[key].items.map((x) => {
            return `- [${x.name}](${x.html_url}) ${x.description ?? ''}`
          }),
        ].join('\n')
      }
    }
  }
  const sortedItems = Object.entries(map).sort(([, { order: orderA }], [, { order: orderB }]) => {
    return orderB - orderA
  })
  const readme = [
    '# icebreaker 的模板集中营',
    '',
    sortedItems.reduce((acc, [key]) => {
      const fragment = generateFragment(key)
      if (fragment) {
        acc.push(fragment)
        acc.push('')
      }
      return acc
    }, [] as string[]).join('\n'),
  ].join('\n')
  return readme
}
