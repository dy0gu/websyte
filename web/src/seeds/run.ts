import config from '@payload-config';
import { getPayload } from 'payload';
import { env } from '$/env';
import { seedDevContent, seedProdContent } from '~/seeds';

const payload = await getPayload({ config: config });

try {
  await seedProdContent(payload);
  if (env.NODE_ENV === 'development') {
    await seedDevContent(payload);
  }
} finally {
  await payload.destroy();
}
