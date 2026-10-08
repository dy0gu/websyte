/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import config from '@payload-config';
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views';
import type { Metadata } from 'next';
import { importMap } from '~/app/(payload)/admin/import-map';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: config, params: params, searchParams: searchParams });

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({
    config: config,
    importMap: importMap,
    params: params,
    searchParams: searchParams,
  });

export default NotFound;
