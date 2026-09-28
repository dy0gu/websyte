import type { Payload } from 'payload'

import { seedFakePosts } from './posts'
import { seedFakeProjects } from './projects'

export const seedFakeContent = async (payload: Payload): Promise<void> => {
  await seedFakeProjects(payload)
  await seedFakePosts(payload)
}
