import type { CollectionAfterChangeHook } from 'payload';
import { revalidateTagWhenAvailable } from '~/i18n/revalidate';

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`);

  revalidateTagWhenAvailable('redirects');

  return doc;
};
