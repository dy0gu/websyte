import { HeaderClient } from './component.client'
import { getCachedGlobal } from '@/utilities/get-globals'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
