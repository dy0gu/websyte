'use client'
import { useTranslations } from 'next-intl'

import type { KeyboardEvent, PointerEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import styles from './game.module.css'

const WIDTH = 260

const PIXEL = 2
const ALIEN_COLS = 7
const ALIEN_ROWS = 4
const ALIEN_W = 8 * PIXEL
const ALIEN_H = 6 * PIXEL
const ALIEN_GAP_X = 10
const ALIEN_GAP_Y = 10
const ALIEN_ORIGIN_Y = 30
const ALIEN_DROP_DISTANCE = 8
const ALIEN_DROP_SPEED = ALIEN_DROP_DISTANCE / 20

const PLAYER_W = 26
const PLAYER_H = 10
const PLAYER_MARGIN = 22
const PLAYER_SPEED = 2.4

const BULLET_W = 2
const BULLET_H = 8
const PLAYER_BULLET_SPEED = 4.5
const ALIEN_BULLET_SPEED = 2.2
const ALIEN_FIRE_CHANCE = 0.03

const TICK_MS = 1000 / 60
const MAX_TICKS_PER_FRAME = 5
const MAX_DEVICE_PIXEL_RATIO = 2

const OBJECT_FILL = '#151515'
const BACKGROUND_FILL = '#f0efe9'
const PLAYER_ACCENT = '#dfff00'
const ENEMY_ACCENT = '#ff5c45'

const ALIEN_FRAMES = [
  ['00100100', '10111101', '11111111', '11011011', '01000010', '00100100'],
  ['00100100', '10111101', '11111111', '11011011', '00100100', '01000010'],
]

type Status = 'idle' | 'lost' | 'paused' | 'playing' | 'won'

type Point = { x: number; y: number }

type Alien = Point & {
  alive: boolean
  col: number
  previousX: number
  previousY: number
  row: number
}

type AlienSprites = HTMLCanvasElement[][]

type Game = {
  aliens: Alien[]
  aliveCount: number
  direction: 1 | -1
  dropRemaining: number
  playerX: number
  previousPlayerX: number
  playerBullet: Point | null
  alienBullets: Point[]
  keys: Set<string>
  shootQueued: boolean
  frame: number
  status: Status
  score: number
  lives: number
}

const formationWidth = ALIEN_COLS * ALIEN_W + (ALIEN_COLS - 1) * ALIEN_GAP_X
const formationOriginX = Math.round((WIDTH - formationWidth) / 2)

const createGame = (): Game => {
  const aliens: Alien[] = []
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      aliens.push({
        alive: true,
        col,
        previousX: formationOriginX + col * (ALIEN_W + ALIEN_GAP_X),
        previousY: ALIEN_ORIGIN_Y + row * (ALIEN_H + ALIEN_GAP_Y),
        row,
        x: formationOriginX + col * (ALIEN_W + ALIEN_GAP_X),
        y: ALIEN_ORIGIN_Y + row * (ALIEN_H + ALIEN_GAP_Y),
      })
    }
  }

  return {
    aliens,
    aliveCount: ALIEN_COLS * ALIEN_ROWS,
    direction: 1,
    dropRemaining: 0,
    playerX: WIDTH / 2 - PLAYER_W / 2,
    previousPlayerX: WIDTH / 2 - PLAYER_W / 2,
    playerBullet: null,
    alienBullets: [],
    keys: new Set(),
    shootQueued: false,
    frame: 0,
    status: 'playing',
    score: 0,
    lives: 3,
  }
}

const intersects = (
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by

const createAlienSprites = (): AlienSprites =>
  [ENEMY_ACCENT, OBJECT_FILL].map((color) =>
    ALIEN_FRAMES.map((bitmap) => {
      const sprite = document.createElement('canvas')
      sprite.width = ALIEN_W
      sprite.height = ALIEN_H
      const context = sprite.getContext('2d')
      if (!context) return sprite

      context.fillStyle = color
      for (let row = 0; row < bitmap.length; row++) {
        for (let column = 0; column < bitmap[row].length; column++) {
          if (bitmap[row][column] === '1') {
            context.fillRect(column * PIXEL, row * PIXEL, PIXEL, PIXEL)
          }
        }
      }

      return sprite
    }),
  )

const pickFrontlineAlien = (aliens: Alien[]) => {
  const frontLine: Array<Alien | null> = Array.from({ length: ALIEN_COLS }, () => null)

  for (const alien of aliens) {
    if (!alien.alive) continue

    const currentFront = frontLine[alien.col]
    if (!currentFront || alien.row > currentFront.row) frontLine[alien.col] = alien
  }

  let candidateCount = 0
  let shooter: Alien | null = null
  for (const alien of frontLine) {
    if (!alien) continue

    candidateCount += 1
    if (Math.random() < 1 / candidateCount) shooter = alien
  }

  return shooter
}

export function Game() {
  const t = useTranslations('UI')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const alienSpritesRef = useRef<AlienSprites | null>(null)
  const gameRef = useRef<Game | null>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number | null>(null)
  const accumulatorRef = useRef(0)
  const pointerRef = useRef<{ startX: number; startY: number; time: number; moved: number } | null>(
    null,
  )
  const [view, setView] = useState({ status: 'idle' as Status, score: 0, lives: 3 })

  const start = useCallback(() => {
    gameRef.current = createGame()
    setView({ status: 'playing', score: 0, lives: 3 })
    canvasRef.current?.focus()
  }, [])

  const tick = useCallback((game: Game, playerY: number, height: number) => {
    game.frame++
    game.previousPlayerX = game.playerX
    for (const alien of game.aliens) {
      alien.previousX = alien.x
      alien.previousY = alien.y
    }

    if (game.keys.has('left')) game.playerX -= PLAYER_SPEED
    if (game.keys.has('right')) game.playerX += PLAYER_SPEED
    game.playerX = Math.max(4, Math.min(WIDTH - PLAYER_W - 4, game.playerX))

    if (game.shootQueued && !game.playerBullet) {
      game.playerBullet = { x: game.playerX + PLAYER_W / 2 - BULLET_W / 2, y: playerY - BULLET_H }
    }
    game.shootQueued = false

    const speed = 0.5 + (ALIEN_COLS * ALIEN_ROWS - game.aliveCount) * 0.045
    let minX = Infinity
    let maxX = -Infinity
    for (const alien of game.aliens) {
      if (!alien.alive) continue
      minX = Math.min(minX, alien.x)
      maxX = Math.max(maxX, alien.x + ALIEN_W)
    }

    let movementX = 0
    let movementY = 0

    if (game.dropRemaining > 0) {
      movementY = Math.min(ALIEN_DROP_SPEED, game.dropRemaining)
      game.dropRemaining -= movementY
    } else if (game.direction === 1 && maxX + speed >= WIDTH - 4) {
      game.direction = -1
      movementY = ALIEN_DROP_SPEED
      game.dropRemaining = ALIEN_DROP_DISTANCE - movementY
    } else if (game.direction === -1 && minX - speed <= 4) {
      game.direction = 1
      movementY = ALIEN_DROP_SPEED
      game.dropRemaining = ALIEN_DROP_DISTANCE - movementY
    } else {
      movementX = speed * game.direction
    }

    for (const alien of game.aliens) {
      if (!alien.alive) continue
      alien.x += movementX
      alien.y += movementY
    }

    // Fire from the lowest surviving alien in a random occupied column
    if (Math.random() < ALIEN_FIRE_CHANCE && game.aliveCount > 0) {
      const shooter = pickFrontlineAlien(game.aliens)
      if (shooter) {
        game.alienBullets.push({ x: shooter.x + ALIEN_W / 2, y: shooter.y + ALIEN_H })
      }
    }

    if (game.playerBullet) {
      game.playerBullet.y -= PLAYER_BULLET_SPEED
      if (game.playerBullet.y + BULLET_H < 0) {
        game.playerBullet = null
      } else {
        for (const alien of game.aliens) {
          if (!alien.alive) continue
          if (
            intersects(
              game.playerBullet.x,
              game.playerBullet.y,
              BULLET_W,
              BULLET_H,
              alien.x,
              alien.y,
              ALIEN_W,
              ALIEN_H,
            )
          ) {
            alien.alive = false
            game.aliveCount -= 1
            game.playerBullet = null
            game.score += 10
            setView((prev) => ({ ...prev, score: game.score }))
            break
          }
        }
      }
    }

    game.alienBullets = game.alienBullets.filter((bullet) => {
      bullet.y += ALIEN_BULLET_SPEED
      if (bullet.y > height) return false
      if (
        intersects(
          bullet.x,
          bullet.y,
          BULLET_W,
          BULLET_H,
          game.playerX,
          playerY,
          PLAYER_W,
          PLAYER_H,
        )
      ) {
        game.lives -= 1
        setView((prev) => ({ ...prev, lives: game.lives }))
        if (game.lives <= 0) {
          game.status = 'lost'
          setView({ status: 'lost', score: game.score, lives: 0 })
        }
        return false
      }
      return true
    })

    if (game.aliveCount === 0) {
      game.status = 'won'
      setView({ status: 'won', score: game.score, lives: game.lives })
    } else if (game.aliens.some((alien) => alien.alive && alien.y + ALIEN_H >= playerY)) {
      game.status = 'lost'
      setView({ status: 'lost', score: game.score, lives: game.lives })
    }
  }, [])

  const step = useCallback(
    (now: number) => {
      const game = gameRef.current
      const canvas = canvasRef.current
      if (!game || !canvas || game.status !== 'playing') return

      const ctx = contextRef.current || canvas.getContext('2d')
      if (!ctx) return
      contextRef.current = ctx

      // Logical width is fixed, but height stretches to the canvas so the
      // game fills the whole frame at any size (player sits at the bottom)
      const scale = canvas.width / WIDTH
      const height = scale > 0 ? canvas.height / scale : WIDTH
      const playerY = height - PLAYER_MARGIN

      // Advance by real elapsed time so pace is framerate-independent; the
      // delta is clamped so returning from a background tab can't fast-forward
      if (lastTimeRef.current === null) lastTimeRef.current = now
      const delta = Math.min(now - lastTimeRef.current, 250)
      lastTimeRef.current = now
      accumulatorRef.current += delta

      let updates = 0
      while (accumulatorRef.current >= TICK_MS && updates < MAX_TICKS_PER_FRAME) {
        tick(game, playerY, height)
        accumulatorRef.current -= TICK_MS
        updates += 1
        if (game.status !== 'playing') {
          accumulatorRef.current = 0
          break
        }
      }

      // Render in the logical space, scaled up to the canvas backing store.
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = BACKGROUND_FILL
      ctx.fillRect(0, 0, WIDTH, height)

      const animFrame = Math.floor(game.frame / 24)
      const interpolation = accumulatorRef.current / TICK_MS
      const sprites = alienSpritesRef.current
      for (const alien of game.aliens) {
        if (!alien.alive) continue

        const sprite = sprites?.[alien.row === 0 ? 0 : 1]?.[animFrame % ALIEN_FRAMES.length]
        if (!sprite) continue

        const x = alien.previousX + (alien.x - alien.previousX) * interpolation
        const y = alien.previousY + (alien.y - alien.previousY) * interpolation
        ctx.drawImage(sprite, x, y)
      }

      ctx.fillStyle = OBJECT_FILL
      const playerX = game.previousPlayerX + (game.playerX - game.previousPlayerX) * interpolation
      ctx.fillRect(playerX, playerY + 4, PLAYER_W, PLAYER_H - 4)
      ctx.fillRect(playerX + PLAYER_W / 2 - 3, playerY, 6, 5)
      ctx.fillStyle = PLAYER_ACCENT
      ctx.fillRect(playerX + PLAYER_W / 2 - 1, playerY + 1, 2, 3)

      if (game.playerBullet) {
        ctx.fillStyle = ENEMY_ACCENT
        ctx.fillRect(game.playerBullet.x, game.playerBullet.y, BULLET_W, BULLET_H)
      }

      ctx.fillStyle = OBJECT_FILL
      for (const bullet of game.alienBullets) {
        ctx.fillRect(bullet.x, bullet.y, BULLET_W, BULLET_H)
      }

      if (game.status === 'playing') {
        rafRef.current = requestAnimationFrame(step)
      }
    },
    [tick],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    alienSpritesRef.current = createAlienSprites()
    contextRef.current = canvas.getContext('2d')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO)
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))

      if (canvas.width === width && canvas.height === height) return
      canvas.width = width
      canvas.height = height
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (view.status !== 'playing') return

    lastTimeRef.current = null
    accumulatorRef.current = 0
    rafRef.current = requestAnimationFrame(step)

    const handleVisibility = () => {
      const game = gameRef.current
      if (!document.hidden || !game || game.status !== 'playing') return
      game.keys.clear()
      game.status = 'paused'
      setView((prev) => ({ ...prev, status: 'paused' }))
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [view.status, step])

  const keyFor = (key: string): string | null => {
    switch (key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        return 'left'
      case 'ArrowRight':
      case 'd':
      case 'D':
        return 'right'
      case ' ':
      case 'ArrowUp':
      case 'w':
      case 'W':
        return 'shoot'
      default:
        return null
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === 'Escape') {
      const game = gameRef.current
      if (game?.status !== 'playing') return

      event.preventDefault()
      game.keys.clear()
      game.status = 'paused'
      setView((prev) => ({ ...prev, status: 'paused' }))
      return
    }

    const mapped = keyFor(event.key)
    if (!mapped) return
    event.preventDefault()
    const game = gameRef.current
    if (game?.status !== 'playing') return
    if (mapped === 'shoot') game.shootQueued = true
    else game.keys.add(mapped)
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const mapped = keyFor(event.key)
    if (!mapped || mapped === 'shoot') return
    gameRef.current?.keys.delete(mapped)
  }

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const game = gameRef.current
    if (game?.status !== 'playing') return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      time: Date.now(),
      moved: 0,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const pointer = pointerRef.current
    const game = gameRef.current
    if (!pointer || !game || game.status !== 'playing') return

    const offsetX = event.clientX - pointer.startX
    pointer.moved = Math.max(
      pointer.moved,
      Math.abs(offsetX),
      Math.abs(event.clientY - pointer.startY),
    )

    // Drag left/right of the touch origin to steer; a small deadzone avoids jitter.
    game.keys.delete('left')
    game.keys.delete('right')
    if (offsetX > 6) game.keys.add('right')
    else if (offsetX < -6) game.keys.add('left')
  }

  const handlePointerUp = () => {
    const pointer = pointerRef.current
    pointerRef.current = null
    const game = gameRef.current
    if (!game) return
    game.keys.delete('left')
    game.keys.delete('right')
    // A quick, near-stationary press counts as a tap to fire.
    if (
      pointer &&
      game.status === 'playing' &&
      pointer.moved < 10 &&
      Date.now() - pointer.time < 300
    ) {
      game.shootQueued = true
    }
  }

  const resume = () => {
    const game = gameRef.current
    if (game?.status !== 'paused') return
    game.status = 'playing'
    setView((prev) => ({ ...prev, status: 'playing' }))
    canvasRef.current?.focus()
  }

  const handleBlur = () => {
    const game = gameRef.current
    if (game?.status !== 'playing') return
    game.keys.clear()
    game.status = 'paused'
    setView((prev) => ({ ...prev, status: 'paused' }))
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hud}>
        <span>
          {t('score')} {String(view.score).padStart(3, '0')}
        </span>
        <span>{'▲'.repeat(Math.max(0, view.lives)) || '—'}</span>
      </div>

      <div className={styles.frame}>
        <canvas
          aria-label={t('gameLabel')}
          className={styles.canvas}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={canvasRef}
          tabIndex={0}
        />

        {view.status !== 'playing' && (
          <div className={styles.overlay}>
            <p className={styles.title}>
              {view.status === 'won'
                ? t('won')
                : view.status === 'lost'
                  ? t('lost')
                  : view.status === 'paused'
                    ? t('paused')
                    : ''}
            </p>
            <div className={styles.buttons}>
              <Button onClick={view.status === 'paused' ? resume : start} type="button">
                {view.status === 'idle'
                  ? t('insertCoin')
                  : view.status === 'paused'
                    ? t('resume')
                    : t('playAgain')}
              </Button>
              {view.status === 'paused' && (
                <Button onClick={start} type="button" variant="destructive">
                  {t('restart')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className={styles.legend}>{t('gameHelp')}</p>
    </div>
  )
}
