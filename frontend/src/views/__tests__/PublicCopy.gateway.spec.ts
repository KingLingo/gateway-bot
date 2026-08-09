import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const notFoundSource = readFileSync(resolve(testDir, '../NotFoundView.vue'), 'utf8')

describe('Gateway Bot public Chinese copy', () => {
  it('uses Chinese explanations and actions on the 404 page', () => {
    expect(notFoundSource).toContain('页面可能已移动，或地址输入有误。')
    expect(notFoundSource).toContain('返回上一页')
    expect(notFoundSource).toContain('前往控制台')
    expect(notFoundSource).not.toContain('Contact support')
  })
})
