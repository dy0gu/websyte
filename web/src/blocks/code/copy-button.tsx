'use client';
import { CopyIcon } from '@payloadcms/ui/icons/Copy';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from '~/blocks/code/component.module.css';
import { Button } from '~/components/ui/button';

export function CopyButton({ code }: { code: string }) {
  const t = useTranslations('UI');
  const [text, setText] = useState('Copy');

  function updateCopyStatus() {
    if (text === 'Copy') {
      setText(() => 'Copied!');
      setTimeout(() => {
        setText(() => 'Copy');
      }, 1000);
    }
  }

  return (
    <div className={styles.copyRow}>
      <Button
        className={styles.copyButton}
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          updateCopyStatus();
        }}
        variant="secondary"
      >
        <p>{t(text === 'Copy' ? 'copy' : 'copied')}</p>
        <CopyIcon />
      </Button>
    </div>
  );
}
