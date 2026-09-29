// @vitest-environment node

import { afterEach, expect, it, vi } from 'vitest'
import { saveThemePreference } from '@/providers/theme/actions'
import { themeCookieMaxAge, themeCookieName } from '@/providers/theme/shared'
import type { ThemePreference } from '@/providers/theme/types'

const { cookies, set } = vi.hoisted(() => {
  const set = vi.fn()
  return { set, cookies: vi.fn(async () => ({ set })) }
})
vi.mock('next/headers', () => ({ cookies }))

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
})

it.each(['light', 'dark', 'auto'] as const)(
  'sets the %s preference on the server',
  async (preference: ThemePreference) => {
    vi.stubEnv('NODE_ENV', 'production')
    await saveThemePreference(preference)
    expect(set).toHaveBeenCalledWith(themeCookieName, preference, {
      path: '/',
      maxAge: themeCookieMaxAge,
      sameSite: 'lax',
      httpOnly: true,
      secure: true,
    })
  },
)

it('allows local HTTP development', async () => {
  vi.stubEnv('NODE_ENV', 'development')
  await saveThemePreference('light')
  expect(set).toHaveBeenCalledWith(
    themeCookieName,
    'light',
    expect.objectContaining({ secure: false }),
  )
})

it.each(['invalid', '', null, undefined, { theme: 'dark' }])(
  'rejects invalid action input %s before touching cookies',
  async (value: unknown) => {
    await expect(saveThemePreference(value as ThemePreference)).rejects.toThrow(
      'Invalid theme preference',
    )
    expect(cookies).not.toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
  },
)
