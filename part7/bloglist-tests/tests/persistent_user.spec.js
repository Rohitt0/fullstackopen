import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { test, expect } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.join(__dirname, '..', '..', 'bloglist', 'frontend', 'src')
const persistentUserPath = path.join(
  srcDir,
  'services',
  'persistentUser.js'
)

const walk = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return walk(full)
    }

    if (/\.jsx?$/.test(entry.name)) {
      return [full]
    }

    return []
  })

const isExported = (name, source) => {
  if (
    new RegExp(
      `export\\s+(?:const|function)\\s+${name}\\b`
    ).test(source)
  ) {
    return true
  }

  const exportBlocks =
    source.match(
      /export\s+default\s*\{[\s\S]*?\}|export\s*\{[\s\S]*?\}/g
    ) || []

  return exportBlocks.some(block =>
    new RegExp(`\\b${name}\\b`).test(block)
  )
}

test.describe('logged-in user persistence', () => {
  test('persistentUser.js exists', () => {
    expect(fs.existsSync(persistentUserPath)).toBe(true)
  })

  test('persistentUser exports the required functions', () => {
    const source = fs.readFileSync(
      persistentUserPath,
      'utf-8'
    )

    expect(isExported('getUser', source)).toBe(true)
    expect(isExported('saveUser', source)).toBe(true)
    expect(isExported('removeUser', source)).toBe(true)
  })

  test('localStorage is only used in persistentUser.js', () => {
    const files = walk(srcDir).filter(
      file => file !== persistentUserPath
    )

    for (const file of files) {
      const source = fs.readFileSync(file, 'utf-8')

      expect(
        source,
        `${path.relative(srcDir, file)} should not use localStorage directly`
      ).not.toMatch(/localStorage/)
    }
  })

  test('getUser is used by the app', () => {
    const files = walk(srcDir).filter(
      file => file !== persistentUserPath
    )

    const callers = files.filter(file =>
      /\bgetUser\s*\(/.test(
        fs.readFileSync(file, 'utf-8')
      )
    )

    expect(callers.length).toBeGreaterThan(0)
  })

  test('saveUser is used by the app', () => {
    const files = walk(srcDir).filter(
      file => file !== persistentUserPath
    )

    const callers = files.filter(file =>
      /\bsaveUser\s*\(/.test(
        fs.readFileSync(file, 'utf-8')
      )
    )

    expect(callers.length).toBeGreaterThan(0)
  })

  test('removeUser is used by the app', () => {
    const files = walk(srcDir).filter(
      file => file !== persistentUserPath
    )

    const callers = files.filter(file =>
      /\bremoveUser\s*\(/.test(
        fs.readFileSync(file, 'utf-8')
      )
    )

    expect(callers.length).toBeGreaterThan(0)
  })
})