import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import type { Locale } from '@/i18n/config'
import { getCachedGlobal } from '@/utilities/get-globals'
import { HeaderClient } from './component.client'

export async function Header() {
  const [headerData, payload, requestHeaders] = await Promise.all([
    getCachedGlobal('header', (await getLocale()) as Locale, 1)(),
    getPayload({ config: configPromise }),
    headers(),
  ])
  const { user } = await payload.auth({ headers: requestHeaders })

  return <HeaderClient data={headerData} isLoggedIn={Boolean(user)} />
}
