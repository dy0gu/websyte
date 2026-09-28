import { runInNewContext } from 'node:vm'
import { act, cleanup, render } from '@testing-library/react'
import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from '@/providers/theme'
import { InitTheme } from '@/providers/theme/init-theme'
import { themeLocalStorageKey } from '@/providers/theme/shared'
import type { ThemeContextType } from '@/providers/theme/types'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('style')
})

describe('theme before hydration', () => {
  it.each([
    ['dark', false, 'dark'],
    ['light', true, 'light'],
    [null, true, 'dark'],
    [null, false, 'light'],
    ['invalid', true, 'dark'],
    ['blocked', true, 'dark'],
  ])('resolves %s with system dark=%s during parsing', (stored: string | null, dark: boolean, expected: string) => {
    const markup = renderToString(createElement(InitTheme))
    document.head.innerHTML = markup
    const script = document.getElementById('theme-script')
    expect(script?.tagName).toBe('SCRIPT')
    runInNewContext(script?.textContent ?? '', {
      document,
      matchMedia: () => ({ matches: dark }),
      localStorage: {
        getItem: () => {
          if (stored === 'blocked') throw new Error('blocked')
          return stored
        },
      },
    })
    expect(document.documentElement.dataset.theme).toBe(expected)
    expect(document.documentElement.style.colorScheme).toBe(expected)
  })
})

let current: ThemeContextType
function Consumer() {
  current = useTheme()
  return createElement('span', null, `${current.preference}:${current.theme}`)
}
const app = () => createElement(ThemeProvider, null, createElement(Consumer))

it('hydrates with identical initial state despite a stored preference', async () => {
  window.localStorage.setItem(themeLocalStorageKey, 'dark')
  const container = document.createElement('div')
  container.innerHTML = renderToString(app())
  expect(container.textContent).toBe('undefined:undefined')
  const errors = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  await act(async () => {
    root = hydrateRoot(container, app(), { onRecoverableError: errors })
  })
  expect(errors).not.toHaveBeenCalled()
  expect(container.textContent).toBe('dark:dark')
  await act(async () => root?.unmount())
})

it('tracks system changes only in auto mode and synchronizes tabs', () => {
  let dark = true
  const media = new EventTarget()
  vi.stubGlobal('matchMedia', () => Object.assign(media, { matches: dark }))
  render(app())
  expect(current.theme).toBe('dark')
  act(() => current.setTheme('light'))
  act(() => media.dispatchEvent(new Event('change')))
  expect(current.theme).toBe('light')
  act(() => current.setTheme(null))
  expect(current.theme).toBe('dark')
  expect(window.localStorage.getItem(themeLocalStorageKey)).toBeNull()
  dark = false
  act(() => media.dispatchEvent(new Event('change')))
  expect(current.theme).toBe('light')
  act(() =>
    window.dispatchEvent(
      new StorageEvent('storage', { key: themeLocalStorageKey, newValue: 'dark' }),
    ),
  )
  expect(current.preference).toBe('dark')
  expect(document.documentElement.dataset.theme).toBe('dark')
})

it('can switch themes when storage is unavailable', () => {
  for (const method of ['getItem', 'setItem', 'removeItem'] as const) {
    vi.spyOn(Storage.prototype, method).mockImplementation(() => {
      throw new Error('blocked')
    })
  }
  render(app())
  act(() => current.setTheme('dark'))
  expect(current.theme).toBe('dark')
  act(() => current.setTheme(null))
  expect(current.theme).toBe('light')
})
