import type { GlobalConfig } from 'payload';

import { link } from '~/fields/link';
import { revalidateHeader } from '~/header/hooks/revalidate-header';

export const Header: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      admin: {
        components: {
          RowLabel: '~/components/payload/row-label#NavigationRowLabel',
        },
        initCollapsed: true,
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      name: 'navItems',
      type: 'array',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
  slug: 'header',
};
