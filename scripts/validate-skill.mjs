#!/usr/bin/env node
/**
 * Validate each SKILL.md file in this repo against the agentskills.io spec:
 * - YAML frontmatter present
 * - `name` (string, kebab-case, ≤ 64 chars)
 * - `description` (string, ≤ 1024 chars)
 * - SKILL.md body is non-empty
 *
 * Exits with code 0 on success, 1 on failure.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = process.cwd()

async function findSkillFiles(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
    const p = join(dir, ent.name)
    if (ent.isDirectory()) {
      out.push(...await findSkillFiles(p))
    } else if (ent.name === 'SKILL.md') {
      out.push(p)
    }
  }
  return out
}

function parseFrontmatter(content) {
  const m = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!m) return { fm: null, body: content }
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.+?)\s*$/)
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  return { fm, body: m[2] }
}

async function validate(filePath) {
  const rel = filePath.replace(ROOT + '/', '')
  const content = await readFile(filePath, 'utf8')
  const errors = []
  const { fm, body } = parseFrontmatter(content)

  if (!fm) {
    errors.push('Missing YAML frontmatter (must start with ---)')
    return { rel, errors }
  }

  if (!fm.name) {
    errors.push('Missing `name` field in frontmatter')
  } else {
    if (fm.name.length > 64) errors.push(`\`name\` exceeds 64 chars (${fm.name.length})`)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) errors.push(`\`name\` must be kebab-case lowercase: got "${fm.name}"`)
  }

  if (!fm.description) {
    errors.push('Missing `description` field in frontmatter')
  } else if (fm.description.length > 1024) {
    errors.push(`\`description\` exceeds 1024 chars (${fm.description.length})`)
  }

  if (body.trim().length === 0) {
    errors.push('SKILL.md body is empty')
  }

  return { rel, errors, name: fm?.name, description: fm?.description }
}

const files = await findSkillFiles(ROOT)
if (files.length === 0) {
  console.error('❌ No SKILL.md files found')
  process.exit(1)
}

let failed = 0
for (const f of files) {
  const result = await validate(f)
  if (result.errors.length === 0) {
    console.log(`✅ ${result.rel}  —  ${result.name}: ${result.description.slice(0, 60)}${result.description.length > 60 ? '…' : ''}`)
  } else {
    failed++
    console.log(`❌ ${result.rel}`)
    for (const err of result.errors) console.log(`   • ${err}`)
  }
}

console.log()
console.log(`Validated ${files.length} skill(s), ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
