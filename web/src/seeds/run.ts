import config from '@payload-config';
import { getPayload } from 'payload';
import { env } from '$/env';
import { seedContactForm } from '~/seeds/contact-form';
import { seedFakeContent } from '~/seeds/fake';

const payload = await getPayload({ config: config });

try {
  await seedContactForm(payload);
  if (env.NODE_ENV === 'development') {
    await seedFakeContent(payload);
  }
} finally {
  await payload.destroy();
}
