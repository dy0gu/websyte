import React from 'react'

import styles from './index.module.css'

const BeforeDashboard: React.FC = () => {
  return (
    <div>
      <ul className={styles.instructions}>
        <li>
          <a href="/" target="_blank">
            Go to website
          </a> <span>↗</span>
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
