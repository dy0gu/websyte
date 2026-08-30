import canUseDOM from './can-use-dom'

export const getServerSideURL = () => {
  return (
    process.env.PUBLIC_SERVER_URL || 'http://localhost:3000'
  )
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return process.env.PUBLIC_SERVER_URL || ''
}
