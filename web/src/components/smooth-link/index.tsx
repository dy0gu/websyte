'use client'

import { useLocale } from 'next-intl'
import type { ComponentPropsWithoutRef, MouseEvent } from 'react'
import { type Locale, localizedPath } from '@/i18n/config'

type SmoothScrollLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href?: string
  targetId: string
}

function smoothScrollTo(targetId: string): boolean {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

  if (targetId === 'top') {
    window.scrollTo({ behavior, top: 0 })
    return true
  }

  const target = document.getElementById(targetId)
  if (!target) return false

  target.scrollIntoView({ behavior, block: 'start' })
  return true
}

/**
 * Smooth scroo
 */
export function SmoothLink({ onClick, href, targetId, ...props }: SmoothScrollLinkProps) {
  const locale = useLocale() as Locale
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    if (smoothScrollTo(targetId)) event.preventDefault()
  }

  // Keep href ID behavior for SEO and JavaScript-disabled browsers, but intercept clicks for smooth scrolling
  return (
    <a
      {...props}
      href={`${href ? localizedPath(href, locale) : ''}#${targetId}`}
      onClick={handleClick}
    />
  )
}
