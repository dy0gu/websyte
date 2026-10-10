'use client';
import { Highlight, themes } from 'prism-react-renderer';
import type React from 'react';
import styles from '~/blocks/code/component.module.css';
import { CopyButton } from '~/blocks/code/copy-button';

type Props = {
  code: string;
  language?: string;
};

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null;

  return (
    <Highlight code={code} language={language} theme={themes.vsDark}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre className={styles.code}>
          {tokens.map((line, lineNumber) => (
            <div
              key={line.map((token) => `${token.types.join('.')}:${token.content}`).join('|')}
              {...getLineProps({ className: styles.line, line: line })}
            >
              <span className={styles.lineNumber}>{lineNumber + 1}</span>
              <span className={styles.lineContent}>
                {line.map((token) => (
                  <span
                    key={`${token.types.join('.')}:${token.content}`}
                    {...getTokenProps({ token: token })}
                  />
                ))}
              </span>
            </div>
          ))}
          <CopyButton code={code} />
        </pre>
      )}
    </Highlight>
  );
};
