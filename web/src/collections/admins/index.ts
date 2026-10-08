import type { CollectionConfig } from 'payload';

import { authenticated } from '~/access/authenticated';

export const Admins: CollectionConfig = {
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    group: 'Accounts',
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  slug: 'admins',
  timestamps: true,
};
