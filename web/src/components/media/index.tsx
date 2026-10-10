import type React from 'react';
import { Fragment } from 'react';
import { ImageMedia } from '~/components/media/image-media';
import type { Props } from '~/components/media/types';
import { VideoMedia } from '~/components/media/video-media';

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props;

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video');
  const Tag = htmlElement || Fragment;

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className: className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  );
};
