import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import type React from 'react';
import styles from '~/blocks/form/form.module.css';
import { Width } from '~/blocks/form/width';
import { RichText } from '~/components/rich-text';

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className={styles.message} width="100">
      {message && <RichText data={message} />}
    </Width>
  );
};
