import type { Payload, RequiredDataFromCollectionSlug } from 'payload';

const defaults: RequiredDataFromCollectionSlug<'admins'> = {
  email: 'test-admin@example.com',
  name: 'Test Admin',
  password: 'test-password',
};

export const createAdmin = async (
  payload: Payload,
  overrides: Partial<RequiredDataFromCollectionSlug<'admins'>> = {},
) => {
  return payload.create({
    collection: 'admins',
    data: { ...defaults, ...overrides },
    depth: 0,
  });
};
