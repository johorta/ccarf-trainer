import { readFileSync, writeFileSync } from 'node:fs'

const path = new URL('../src/data.ts', import.meta.url)
let content = readFileSync(path, 'utf8')

for (const key of ['edge case', 'sliding window', 'false positive', 'built-in', 'out-of-role']) {
  content = content.replaceAll(` ${key}:`, ` '${key}':`)
}

writeFileSync(path, content, 'utf8')
