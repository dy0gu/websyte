import { getPayload, type Payload } from 'payload';
import { beforeAll, expect, it } from 'vitest';
import { scope } from '$/tests/helpers/scope';
import config from '~/payload.config';

let payload: Payload;

scope('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config;
    payload = await getPayload({ config: payloadConfig });
  });

  it('fetches admins', async () => {
    const admins = await payload.find({
      collection: 'admins',
    });
    expect(admins).toBeDefined();
  });
});
