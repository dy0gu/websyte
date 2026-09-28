import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import { localizedPath } from '@/i18n/config'
import { getCachedRedirects } from '@/utilities/get-redirects'

export async function PayloadRedirects({
  disableNotFound,
  url,
}: {
  disableNotFound?: boolean
  url: string
}) {
  const locale = await getLocale()
  const redirects = await getCachedRedirects()()
  const item =
    redirects.find((item) => item.from === localizedPath(url, locale)) ??
    redirects.find((item) => item.from === url)
  if (item?.to?.url) redirect(localizedPath(item.to.url, locale))
  if (item?.to?.reference) {
    const { relationTo, value } = item.to.reference
    const payload = await getPayload({ config })
    const doc =
      typeof value === 'object'
        ? value
        : await payload.findByID({
            collection: relationTo,
            id: value,
            locale,
            overrideAccess: false,
          })
    if (doc?.slug) {
      const path =
        relationTo === 'pages'
          ? doc.slug === 'home'
            ? '/'
            : `/${doc.slug}`
          : relationTo === 'projects'
            ? '/projects'
            : `/posts/${doc.slug}`
      redirect(localizedPath(path, locale))
    }
  }
  if (!disableNotFound) notFound()
  return null
}
