'use client';
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react';
import type React from 'react';
import { useRouter } from '~/i18n/navigation';
import { getClientSideURL } from '~/utilities/get-url';

export const LivePreviewListener: React.FC = () => {
  const router = useRouter();
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />;
};
