import configPromise from '@payload-config';
import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import styles from '~/header/component.module.css';
import { HeaderNav } from '~/header/nav';
import type { Locale } from '~/i18n/config';
import shared from '~/styles/shared.module.css';
import { getCachedGlobal } from '~/utilities/get-globals';
import { cn } from '~/utilities/ui';

export async function Header() {
  const [headerData, payload, requestHeaders] = await Promise.all([
    getCachedGlobal('header', (await getLocale()) as Locale, 1)(),
    getPayload({ config: configPromise }),
    headers(),
  ]);
  const { user } = await payload.auth({ headers: requestHeaders });

  return (
    <header className={styles.root}>
      <div className={cn(shared.container, styles.inner)}>
        <HeaderNav data={headerData} isLoggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
