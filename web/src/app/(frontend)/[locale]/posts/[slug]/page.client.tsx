'use client'
import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/header-theme'

const PageClient: React.FC = () => {
  /* The editorial hero uses the light paper background. */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  return <React.Fragment />
}

export default PageClient
