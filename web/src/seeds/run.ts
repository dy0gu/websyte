import config from '@payload-config'
import { getPayload } from 'payload'

import { seedFakeContent } from './fake'
import { seedContactForm } from './contact-form'

const payload = await getPayload({ config })

try {
  await seedContactForm(payload)
  if (process.env.NODE_ENV === 'development') {
    await seedFakeContent(payload)
  }
} finally {
  await payload.destroy()
}
