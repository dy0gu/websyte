'use client';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useRouter } from '~/i18n/navigation';
import styles from '~/search/component.module.css';
import shared from '~/styles/shared.module.css';
import { useDebounce } from '~/utilities/use-debounce';

export const Search: React.FC = () => {
  const t = useTranslations('UI');
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [value, setValue] = useState(query);
  const router = useRouter();

  const debouncedValue = useDebounce(value);

  useEffect(() => {
    if (debouncedValue === query) return;
    router.replace(`/search${debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''}`);
  }, [debouncedValue, query, router]);

  return (
    <div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Label className={shared.srOnly} htmlFor="search">
          {t('search')}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder={t('search')}
          value={value}
        />
        <button className={shared.srOnly} type="submit">
          {t('submit')}
        </button>
      </form>
    </div>
  );
};
