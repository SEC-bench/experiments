import * as yaml from 'js-yaml'
import * as fs from 'node:fs/promises'

const GITHUB_URL = 'https://github.com/SEC-bench/experiments/tree/main/evaluation'

const index = yaml.load(await fs.readFile('lite_index.yaml', 'utf8')) as Record<string, {
  tabName: string
  displayName: string
}>

interface Result {
  name: string
  oss: boolean
  verified: boolean
  orgIcon?: string
  site: string
  resolvedRate: number
  resolved: number
  resolvedEasy: number
  resolvedMedium: number
  resolvedHard: number
  date: string
  path: string
  logs?: string
  trajs?: string
  hasReadme: boolean
  hasLogs: boolean
  hasTrajs: boolean
}

interface Language {
  tabName: string
  displayName: string
  models: any[]
}

// Helper function to safely parse JSON lines
function parseJsonLines(content: string): any[] {
  // Check if this is a Git LFS pointer file
  if (content.trim().startsWith('version https://git-lfs.github.com/spec/v1')) {
    console.warn('Detected Git LFS pointer file - actual content not available')
    return []
  }

  return content
    .trim()
    .split('\n')
    .filter(line => line.trim().length > 0) // Skip empty lines
    .map(line => {
      try {
        return JSON.parse(line)
      } catch (error) {
        console.warn(`Skipping invalid JSON line: ${line.substring(0, 50)}...`)
        return null
      }
    })
    .filter(item => item !== null) // Remove failed parses
}

const leaderboard: Language[] = []

for (const [langKey, langValue] of Object.entries(index)) {
  const lang: Language = {
    tabName: langValue.tabName,
    displayName: langValue.displayName,
    models: [],
  }

  leaderboard.push(lang)

  const basePath = `evaluation/${langValue.tabName}`
  const dirents = await fs.readdir(basePath, { withFileTypes: true })

  const results = await Promise.allSettled(
    dirents
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map<Promise<Result>>(async (dirent) => {
        const path = `${dirent.name}`
        const metadata = yaml.load(await fs.readFile(`${basePath}/${path}/metadata.yaml`, 'utf8')) as any
        const filecontent = await fs.readFile(`${basePath}/${path}/report.jsonl`, 'utf8')
        const report = parseJsonLines(filecontent)
        const urlLogs = `${GITHUB_URL}/${basePath}/${path}/logs`
        const urlTrajs = `${GITHUB_URL}/${basePath}/${path}/trajs`
        const hasLogs = await fs.access(`${basePath}/${path}/logs`).then(() => true, () => false)
        const hasTrajs = await fs.access(`${basePath}/${path}/trajs`).then(() => true, () => false)
        const hasReadme = await fs.access(`${basePath}/${path}/README.md`).then(() => true, () => false)

        // Calculate statistics
        const successfulResults = report.filter(item => item.success)
        const totalResults = report.length

        return {
          name: metadata.name,
          oss: metadata.oss,
          verified: metadata.verified,
          orgIcon: metadata.orgIcon,
          site: metadata.site,
          date: metadata.date instanceof Date
            ? metadata.date.toISOString().slice(0, 10)
            : String(metadata.date),
          resolvedRate: totalResults > 0 ? successfulResults.length / totalResults : 0,
          resolved: successfulResults.length,
          // For now, we're using the same count for all difficulty levels
          // In the future, this could be enhanced to parse difficulty from instance_id or other metadata
          resolvedEasy: successfulResults.length,
          resolvedMedium: successfulResults.length,
          resolvedHard: successfulResults.length,
          path: `${basePath}/${path}`,
          logs: hasLogs ? urlLogs : undefined,
          trajs: hasTrajs ? urlTrajs : undefined,
          hasLogs,
          hasTrajs,
          hasReadme,
        }
      })
  )

  const fulfilledResults = results
    .filter((r) => {
      if (r.status === 'rejected') {
        console.error(r.reason)
      }
      return r.status === 'fulfilled'
    })
    .map((r) => (r as PromiseFulfilledResult<Result>).value)

  fulfilledResults.sort((a, b) => b.resolved - a.resolved)

  lang.models = fulfilledResults
}

await fs.mkdir('dist', { recursive: true })
await fs.writeFile('dist/leaderboard-mini.json', JSON.stringify(leaderboard, null, 2))
