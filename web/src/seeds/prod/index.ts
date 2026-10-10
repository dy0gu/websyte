import type { Payload } from 'payload';
import { seedContactForm } from '~/seeds/prod/contact';

export const seedProdContent = async (payload: Payload): Promise<void> => {
  await seedContactForm(payload);
};
