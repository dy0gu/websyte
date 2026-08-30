import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from '@/app/(frontend)/pages.module.css'

export default function NotFound() {
  return (
    <div className={cn(shared.container, styles.notFound)}>
      <div className={shared.prose}>
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className={styles.notFoundMessage}>This page could not be found.</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
