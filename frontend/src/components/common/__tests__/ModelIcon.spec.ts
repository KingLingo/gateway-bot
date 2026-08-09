import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ModelIcon from '../ModelIcon.vue'

describe('ModelIcon', () => {
  it('renders the OpenAI mark for the exact OpenAI platform identifier', () => {
    const wrapper = mount(ModelIcon, { props: { model: 'openai' } })

    expect(wrapper.find('svg.model-icon').exists()).toBe(true)
    expect(wrapper.find('.model-icon-fallback').exists()).toBe(false)
    expect(wrapper.find('path').attributes('fill')).toBe('currentColor')
  })
})
