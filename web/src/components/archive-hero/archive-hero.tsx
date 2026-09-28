import styles from './archive-hero.module.css'

type ArchiveHeroProps = {
  description: string
  eyebrow: string
  title: string
}

export function ArchiveHero({ description, eyebrow, title }: ArchiveHeroProps) {
  return (
    <header className={styles.root}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.meta}>
        <span>{eyebrow}</span>
      </div>
      <div className={styles.heading}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  )
}
