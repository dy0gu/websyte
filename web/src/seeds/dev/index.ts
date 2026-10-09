import type { Payload } from 'payload';

import { seedFakePosts } from '~/seeds/dev/posts';
import { seedFakeProjects } from '~/seeds/dev/projects';

export const seedDevContent = async (payload: Payload): Promise<void> => {
  await seedFakeProjects(payload);
  await seedFakePosts(payload);
};
