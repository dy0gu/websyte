import clsx from 'clsx';
import Image from 'next/image';
import styles from '~/components/logo/logo.module.css';

type Props = {
  className?: string;
};

export function AdminLogo(props: Props) {
  const { className } = props;

  return (
    <Image
      alt="DIOGO"
      className={clsx(styles.logoIcon, className)}
      height={32}
      src="/favicon.svg"
      width={32}
    />
  );
}
