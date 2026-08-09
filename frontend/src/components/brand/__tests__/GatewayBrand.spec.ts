import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import GatewayBrand from '../GatewayBrand.vue'

describe('GatewayBrand', () => {
  it('renders consumer-provided mark and name classes on the visible brand elements', () => {
    const wrapper = mount(GatewayBrand, {
      props: {
        markClass: 'auth-mark',
        nameClass: 'brand-name',
      },
    })

    expect(wrapper.get('.gateway-brand-mark').classes()).toContain('auth-mark')
    expect(wrapper.get('.gateway-brand-name').classes()).toContain('brand-name')
  })

  it('omits the wordmark in compact mode', () => {
    const wrapper = mount(GatewayBrand, { props: { compact: true } })

    expect(wrapper.find('.gateway-brand-mark').exists()).toBe(true)
    expect(wrapper.find('.gateway-brand-name').exists()).toBe(false)
  })
})
