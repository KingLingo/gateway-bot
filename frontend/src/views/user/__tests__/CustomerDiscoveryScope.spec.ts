import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineComponent } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { CheckoutInfoResponse, SubscriptionPlan } from '@/types/payment'

const routeState = vi.hoisted(() => ({ query: { tab: 'subscription' } }))
const getCheckoutInfo = vi.hoisted(() => vi.fn())
const getAvailableChannels = vi.hoisted(() => vi.fn().mockResolvedValue([]))
const getUserGroupRates = vi.hoisted(() => vi.fn().mockResolvedValue({}))
const activeSubscriptions = vi.hoisted(() => [] as Array<Record<string, unknown>>)

vi.mock('vue-router', () => ({
  useRoute: () => routeState,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), resolve: vi.fn() }),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ user: { username: 'demo-user', balance: 0 }, refreshUser: vi.fn() }),
}))

vi.mock('@/stores/payment', () => ({ usePaymentStore: () => ({ createOrder: vi.fn() }) }))
vi.mock('@/stores/subscriptions', () => ({
  useSubscriptionStore: () => ({ activeSubscriptions, fetchActiveSubscriptions: vi.fn().mockResolvedValue(undefined) }),
}))
vi.mock('@/stores', () => ({
  useAppStore: () => ({ showError: vi.fn(), showInfo: vi.fn(), showWarning: vi.fn() }),
}))
vi.mock('@/api/payment', () => ({ paymentAPI: { getCheckoutInfo } }))
vi.mock('@/utils/device', () => ({ isMobileDevice: () => true }))
vi.mock('@/api/channels', () => ({
  default: { getAvailable: getAvailableChannels },
  userChannelsAPI: { getAvailable: getAvailableChannels },
}))
vi.mock('@/api/groups', () => ({ default: { getUserGroupRates } }))
vi.mock('@/stores/app', () => ({ useAppStore: () => ({ showError: vi.fn() }) }))

import PaymentView from '../PaymentView.vue'
import AvailableChannelsView from '../AvailableChannelsView.vue'

const viewDir = dirname(fileURLToPath(import.meta.url))
const channels = readFileSync(resolve(viewDir, '../AvailableChannelsView.vue'), 'utf8')
const payment = readFileSync(resolve(viewDir, '../PaymentView.vue'), 'utf8')
const createAccount = readFileSync(resolve(viewDir, '../../../components/account/CreateAccountModal.vue'), 'utf8')

describe('Customer-facing provider discovery', () => {
  it('renders only GPT and Claude channel sections for customers', async () => {
    const ChannelsTableStub = defineComponent({
      props: { rows: { type: Array, required: true } },
      template: '<div><template v-for="channel in rows"><span v-for="section in channel.platforms" data-testid="channel-section">{{ section.platform }}:{{ section.supported_models[0].name }}</span></template></div>',
    })
    getAvailableChannels.mockResolvedValue([
      {
        name: 'Gateway Bot',
        description: '',
        platforms: [
          { platform: 'openai', groups: [], supported_models: [{ name: 'GPT-5', platform: 'openai', pricing: null }] },
          { platform: 'anthropic', groups: [], supported_models: [{ name: 'Claude 4', platform: 'anthropic', pricing: null }] },
          { platform: 'gemini', groups: [], supported_models: [{ name: 'Gemini 2.5', platform: 'gemini', pricing: null }] },
          { platform: 'grok', groups: [], supported_models: [{ name: 'Grok 4', platform: 'grok', pricing: null }] },
        ],
      },
    ])
    const wrapper = shallowMount(AvailableChannelsView, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          TablePageLayout: { template: '<div><slot name="filters" /><slot name="table" /></div>' },
          AvailableChannelsTable: ChannelsTableStub,
        },
      },
    })
    await flushPromises()

    expect(wrapper.findAll('[data-testid="channel-section"]').map((section) => section.text())).toEqual([
      'openai:GPT-5',
      'anthropic:Claude 4',
    ])
  })

  it('derives available channels from the GPT and Claude platforms only', () => {
    expect(channels).toContain("const CUSTOMER_VISIBLE_PLATFORMS = new Set(['openai', 'anthropic'])")
    expect(channels).toContain('const customerChannels = computed(() =>')
    expect(channels).toMatch(/channels\.value\s*\.map\(\(channel\) => \(\{/)
    expect(channels).toContain('filter((section) => CUSTOMER_VISIBLE_PLATFORMS.has(section.platform))')
    expect(channels).toContain('const visibleChannels = customerChannels.value')
  })

  it('limits new subscription discovery without hiding existing renewal records', () => {
    expect(payment).toContain("const CUSTOMER_VISIBLE_PLATFORMS = new Set(['openai', 'anthropic'])")
    expect(payment).toContain('const customerPlans = computed(() =>')
    expect(payment).toContain("checkout.value.plans.filter((plan) => CUSTOMER_VISIBLE_PLATFORMS.has(plan.group_platform || ''))")
    expect(payment).toContain('v-if="customerPlans.length === 0"')
    expect(payment).toContain('v-for="plan in customerPlans"')
    expect(payment).toContain('const renewalPlans = computed(() =>')
  })

  it('renders OpenAI plans while hiding Gemini plans from subscription discovery', async () => {
    const plan = (id: number, name: string, platform: string): SubscriptionPlan => ({
      id,
      name,
      group_id: id,
      description: '',
      price: 10,
      original_price: 0,
      validity_days: 30,
      validity_unit: 'day',
      rate_multiplier: 1,
      daily_limit_usd: null,
      weekly_limit_usd: null,
      monthly_limit_usd: null,
      features: [],
      group_platform: platform,
      sort_order: id,
      for_sale: true,
      group_name: platform,
    })
    const checkout: CheckoutInfoResponse = {
      methods: {},
      global_min: 0,
      global_max: 0,
      plans: [plan(1, 'GPT Plan', 'openai'), plan(2, 'Gemini Plan', 'gemini')],
      balance_disabled: false,
      balance_recharge_multiplier: 1,
      subscription_usd_to_cny_rate: 0,
      recharge_fee_rate: 0,
      help_text: '',
      help_image_url: '',
      stripe_publishable_key: '',
    }
    getCheckoutInfo.mockResolvedValue({ data: checkout })

    const PlanCardStub = defineComponent({
      props: { plan: { type: Object, required: true } },
      template: '<article data-testid="subscription-plan">{{ plan.name }}</article>',
    })
    const wrapper = shallowMount(PaymentView, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          SubscriptionPlanCard: PlanCardStub,
          Teleport: true,
          Transition: false,
        },
      },
    })
    await flushPromises()

    expect(wrapper.findAll('[data-testid="subscription-plan"]').map((card) => card.text())).toEqual([
      'GPT Plan',
    ])
  })

  it('keeps historical Gemini and Grok plans available for renewal', async () => {
    const plan = (id: number, name: string, groupId: number, platform: string): SubscriptionPlan => ({
      id,
      name,
      group_id: groupId,
      description: '',
      price: 10,
      original_price: 0,
      validity_days: 30,
      validity_unit: 'day',
      rate_multiplier: 1,
      daily_limit_usd: null,
      weekly_limit_usd: null,
      monthly_limit_usd: null,
      features: [],
      group_platform: platform,
      sort_order: id,
      for_sale: true,
      group_name: `${platform} Legacy`,
    })
    activeSubscriptions.splice(
      0,
      activeSubscriptions.length,
      { id: 1, group_id: 900, status: 'active', expires_at: null, group: { name: 'Gemini Legacy', platform: 'gemini', rate_multiplier: 1 } },
      { id: 2, group_id: 901, status: 'active', expires_at: null, group: { name: 'Grok Legacy', platform: 'grok', rate_multiplier: 1 } },
    )
    const checkout: CheckoutInfoResponse = {
      methods: {},
      global_min: 0,
      global_max: 0,
      plans: [
        plan(1, 'GPT Plan', 1, 'openai'),
        plan(2, 'Gemini Monthly Renewal', 900, 'gemini'),
        plan(3, 'Gemini Annual Renewal', 900, 'gemini'),
        plan(4, 'Grok Monthly Renewal', 901, 'grok'),
        plan(5, 'Grok Annual Renewal', 901, 'grok'),
      ],
      balance_disabled: false,
      balance_recharge_multiplier: 1,
      subscription_usd_to_cny_rate: 0,
      recharge_fee_rate: 0,
      help_text: '',
      help_image_url: '',
      stripe_publishable_key: '',
    }
    getCheckoutInfo.mockReset().mockResolvedValue({ data: checkout })
    routeState.query = { tab: 'subscription', group: '900' }
    const PlanCardStub = defineComponent({
      props: { plan: { type: Object, required: true } },
      template: '<article data-testid="subscription-plan">{{ plan.name }}</article>',
    })
    const mountPaymentView = () => shallowMount(PaymentView, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          SubscriptionPlanCard: PlanCardStub,
          Teleport: true,
          Transition: false,
        },
      },
    })
    const geminiWrapper = mountPaymentView()
    await flushPromises()

    expect(geminiWrapper.text()).toContain('Gemini Legacy')
    expect(geminiWrapper.text()).toContain('Grok Legacy')
    expect(geminiWrapper.findAll('[data-testid="subscription-plan"]').map((card) => card.text())).toEqual([
      'GPT Plan',
      'Gemini Monthly Renewal',
      'Gemini Annual Renewal',
    ])

    routeState.query = { tab: 'subscription', group: '901' }
    const grokWrapper = mountPaymentView()
    await flushPromises()

    expect(grokWrapper.findAll('[data-testid="subscription-plan"]').map((card) => card.text())).toEqual([
      'GPT Plan',
      'Grok Monthly Renewal',
      'Grok Annual Renewal',
    ])
  })

  it('offers only OpenAI and Anthropic in the new admin account picker', () => {
    expect(createAccount).toContain('data-testid="platform-anthropic"')
    expect(createAccount).toContain('data-testid="platform-openai"')
    expect(createAccount).not.toContain('@click="form.platform = \'gemini\'"')
    expect(createAccount).not.toContain('@click="form.platform = \'grok\'"')
    expect(createAccount).not.toContain('@click="form.platform = \'antigravity\'"')
  })
})
