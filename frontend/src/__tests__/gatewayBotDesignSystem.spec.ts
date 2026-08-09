import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const tailwindSource = readFileSync(resolve(frontendRoot, 'tailwind.config.js'), 'utf8')
const styleSource = readFileSync(resolve(frontendRoot, 'src/style.css'), 'utf8')

describe('Gateway Bot design system', () => {
  it('defines the approved olive, paper, and clay palette', () => {
    expect(tailwindSource).toContain("500: '#69B086'")
    expect(tailwindSource).toContain("950: '#0F1512'")
    expect(tailwindSource).toContain("paper: '#F5F3ED'")
    expect(tailwindSource).toContain("clay: '#C76D4E'")
    expect(styleSource).toContain('--gb-surface: #fcfbf7')
    expect(styleSource).toContain('--gb-surface-dark: #171f1b')
  })

  it('uses restrained controls and reduced-motion fallbacks', () => {
    const buttonBlock = styleSource.match(/\.btn\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? ''
    const primaryButtonBlock = styleSource.match(/\.btn-primary\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? ''
    const cardBlock = styleSource.match(/\.card\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? ''

    expect(buttonBlock).toContain('rounded-[4px]')
    expect(cardBlock).toContain('rounded-[6px]')
    expect(primaryButtonBlock).not.toContain('bg-gradient')
    expect(styleSource).toContain('@media (prefers-reduced-motion: reduce)')
  })

  it('uses the Gateway Bot type stack and tabular numeric data', () => {
    expect(tailwindSource).toContain("'Geist Variable'")
    expect(tailwindSource).toContain("'Noto Sans SC'")
    expect(styleSource).toContain('font-variant-numeric: tabular-nums')
  })
})
