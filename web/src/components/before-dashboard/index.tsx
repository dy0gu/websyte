import type React from 'react';

import styles from '~/components/before-dashboard/index.module.css';

export const BeforeDashboard: React.FC = () => {
  return (
    <div>
      <ul className={styles.instructions}>
        <li>
          <a href="/" rel="noopener" target="_blank">
            Go to website
          </a>{' '}
          <span>↗</span>
        </li>
      </ul>
    </div>
  );
};
