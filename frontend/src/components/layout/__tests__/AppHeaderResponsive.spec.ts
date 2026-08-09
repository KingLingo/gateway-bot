import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const source = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../AppHeader.vue'), 'utf8')

describe('AppHeader responsive layout', () => {
  it('lets long page descriptions shrink without pushing actions outside the viewport', () => {
    expect(source).toContain('class="flex min-w-0 flex-1 items-center gap-2 sm:gap-4"')
    expect(source).toContain('class="hidden min-w-0 lg:block"')
    expect(source).toContain('class="truncate text-xs text-gray-500 dark:text-dark-400"')
    expect(source).toContain('class="flex shrink-0 items-center gap-1 sm:gap-3"')
  })
})
