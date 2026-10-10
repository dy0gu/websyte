import { getPayload, type Payload } from 'payload';
import { beforeAll, expect, it } from 'vitest';
import { scope } from '$/tests/helpers/scope';
import config from '~/payload.config';
import { seedProdContent } from '~/seeds';

let payload: Payload;

scope('seeds', () => {
  beforeAll(async () => {
    const payloadConfig = await config;
    payload = await getPayload({ config: payloadConfig });
  });

  it('does not create another contact form when run again', async () => {
    await seedProdContent(payload);
    await seedProdContent(payload);

    const contactForms = await payload.find({
      collection: 'forms',
      depth: 0,
      pagination: false,
      where: {
        formKey: {
          equals: 'contact',
        },
      },
    });

    expect(contactForms.docs).toHaveLength(1);
  });
});
