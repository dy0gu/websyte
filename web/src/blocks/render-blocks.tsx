import type React from 'react';
import { Fragment } from 'react';
import { ArchiveBlock } from '~/blocks/archive-block/component';
import { CallToActionBlock } from '~/blocks/call-to-action/component';
import { ContentBlock } from '~/blocks/content/component';
import { FormBlock } from '~/blocks/form/component';
import { MediaBlock } from '~/blocks/media-block/component';
import styles from '~/blocks/render-blocks.module.css';
import type { Page } from '~/payload-types';

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
};

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][];
}> = (props) => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <div className={styles.block} key={block.id ?? block.blockName ?? block.blockType}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
