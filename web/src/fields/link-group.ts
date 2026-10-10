import type { ArrayField, Field } from 'payload';
import type { LinkAppearances } from '~/fields/link';
import { link } from '~/fields/link';
import { deepMerge } from '~/utilities/deep-merge';

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false;
  overrides?: Partial<ArrayField>;
}) => Field;

export const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    admin: {
      initCollapsed: true,
    },
    fields: [
      link({
        appearances: appearances,
      }),
    ],
    name: 'links',
    type: 'array',
  };

  return deepMerge(generatedLinkGroup, overrides);
};
