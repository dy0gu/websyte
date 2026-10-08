import type { Payload } from 'payload';

import { seedFakePosts } from '~/seeds/fake/posts';
import { seedFakeProjects } from '~/seeds/fake/projects';

export const seedFakeContent = async (payload: Payload): Promise<void> => {
  await seedFakeProjects(payload);
  await seedFakePosts(payload);
};
