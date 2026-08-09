import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const tailwindSource = readFileSync(resolve(frontendRoot, 'tailwind.config.js'), 'utf8')
const styleSource = readFileSync(resolve(frontendRoot, 'src/style.css'), 'utf8')

describe('Gateway Bot design system', () => {
  it('defines the approved cold silver, graphite, and restrained moss palette', () => {
    expect(tailwindSource).toContain("500: '#66866D'")
    expect(tailwindSource).toContain("950: '#0B0D0F'")
    expect(tailwindSource).toContain("paper: '#F4F6F8'")
    expect(tailwindSource).toContain("clay: '#B8684F'")
    expect(styleSource).toContain('--gb-surface: #FFFFFF')
    expect(styleSource).toContain('--gb-surface-dark: #16191C')
    expect(styleSource).toContain('bg-white/70 backdrop-blur-xl')
  })

  it('uses restrained controls and reduced-motion fallbacks', () => {
    const buttonBlock = styleSource.match(/\.btn\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? ''
    const primaryButtonBlock = styleSource.match(/\.btn-primary\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? ''
    const cardBlock = styleSource.match(/\.card\s*\{[\s\S]*?\n {2}\}/)?.[0] ?? ''

    expect(buttonBlock).toContain('rounded-[6px]')
    expect(cardBlock).toContain('rounded-[8px]')
    expect(primaryButtonBlock).not.toContain('bg-gradient')
    expect(styleSource).toContain('@media (prefers-reduced-motion: reduce)')
  })

  it('uses the Apple-native type stack and tabular numeric data', () => {
    expect(tailwindSource).toContain("'-apple-system'")
    expect(tailwindSource).toContain("'SF Pro Display'")
    expect(tailwindSource).toContain("'PingFang SC'")
    expect(tailwindSource).toContain("'Noto Sans SC'")
    expect(styleSource).toContain('font-variant-numeric: tabular-nums')
  })
})
