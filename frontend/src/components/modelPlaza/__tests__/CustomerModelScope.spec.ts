import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { ModelPlazaResponse } from '@/api/modelPlaza'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ isAuthenticated: true }),
}))

import ModelPlazaContent from '../ModelPlazaContent.vue'

const componentDir = dirname(fileURLToPath(import.meta.url))
const home = readFileSync(resolve(componentDir, '../../../views/HomeView.vue'), 'utf8')

describe('Customer model scope', () => {
  it('renders only OpenAI and Anthropic groups for customers', () => {
    const GroupStub = defineComponent({
      props: { group: { type: Object, required: true } },
      template: '<article data-testid="plaza-group">{{ group.name }}</article>',
    })
    const response: ModelPlazaResponse = {
      description: '',
      groups: [
        { id: 1, name: 'GPT', platform: 'openai', description: '', subscription_type: 'standard', rate_multiplier: 1, peak_rate_enabled: false, peak_start: '', peak_end: '', peak_rate_multiplier: 1, is_exclusive: false, image_rate_independent: false, image_rate_multiplier: 1, models: [] },
        { id: 2, name: 'Claude', platform: 'anthropic', description: '', subscription_type: 'standard', rate_multiplier: 1, peak_rate_enabled: false, peak_start: '', peak_end: '', peak_rate_multiplier: 1, is_exclusive: false, image_rate_independent: false, image_rate_multiplier: 1, models: [] },
        { id: 3, name: 'Gemini', platform: 'gemini', description: '', subscription_type: 'standard', rate_multiplier: 1, peak_rate_enabled: false, peak_start: '', peak_end: '', peak_rate_multiplier: 1, is_exclusive: false, image_rate_independent: false, image_rate_multiplier: 1, models: [] },
        { id: 4, name: 'Grok', platform: 'grok', description: '', subscription_type: 'standard', rate_multiplier: 1, peak_rate_enabled: false, peak_start: '', peak_end: '', peak_rate_multiplier: 1, is_exclusive: false, image_rate_independent: false, image_rate_multiplier: 1, models: [] },
      ],
    }

    const wrapper = mount(ModelPlazaContent, {
      props: { response, loading: false },
      global: {
        stubs: {
          PlazaFilterBar: true,
          PlazaGroupSection: GroupStub,
          Icon: true,
        },
      },
    })

    expect(wrapper.findAll('[data-testid="plaza-group"]').map((group) => group.text())).toEqual([
      'Claude',
      'GPT',
    ])
    expect(wrapper.text()).toContain('更多模型敬请期待')
  })

  it('does not promote Gemini or Grok on the public home surface', () => {
    expect(home).toContain('GPT')
    expect(home).toContain('Claude')
    expect(home).toContain('更多模型敬请期待')
    expect(home).not.toContain('<span>Gemini</span>')
    expect(home).not.toContain('<span>Grok</span>')
  })
})
