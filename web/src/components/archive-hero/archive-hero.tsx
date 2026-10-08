import styles from '~/components/archive-hero/archive-hero.module.css';

type ArchiveHeroProps = {
  description: string;
  eyebrow?: string;
  title: string;
};

export function ArchiveHero({ description, eyebrow, title }: ArchiveHeroProps) {
  return (
    <header className={styles.root}>
      <div aria-hidden="true" className={styles.grid} />
      {eyebrow && (
        <div className={styles.meta}>
          <span>{eyebrow}</span>
        </div>
      )}
      <div className={styles.heading}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
