import clsx from 'clsx'
import styles from './logo.module.css'

interface Props {
  className?: string
}

export function Logo(props: Props) {
  const { className } = props

  return <span className={clsx(styles.logo, className)}>DIOGO</span>
}

export default (props: Props) => {
  const { className } = props

  return (
    <img
      src="/favicon.svg"
      alt="DIOGO"
      className={clsx(styles.logoIcon, className)}
    />
  )
}
