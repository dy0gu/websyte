'use client'

import { useLayoutEffect } from 'react'

export function RevealObserver() {
  useLayoutEffect(() => {
    const revealRoot = document.querySelector('[data-reveal-root]')
    if (!revealRoot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const documentRoot = document.documentElement
    const nodes = revealRoot.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          entry.target.setAttribute('data-visible', 'true')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12 },
    )

    nodes.forEach((node) => {
      const bounds = node.getBoundingClientRect()
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        node.setAttribute('data-visible', 'true')
      }

      observer.observe(node)
    })

    documentRoot.setAttribute('data-reveal-ready', 'true')

    return () => {
      observer.disconnect()
      documentRoot.removeAttribute('data-reveal-ready')
    }
  }, [])

  return null
}
