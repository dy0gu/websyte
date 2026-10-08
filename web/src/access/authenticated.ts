import type { AccessArgs } from 'payload';

import type { Admin } from '~/payload-types';

type IsAuthenticated = (args: AccessArgs<Admin>) => boolean;

export const authenticated: IsAuthenticated = ({ req: { user } }) => {
  return Boolean(user);
};
