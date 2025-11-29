export type MovementSpeed = 'Standard' | 'Fast' | 'Very Fast'

export interface BotConfig {
  damageMultiplier: number
  movementSpeed: MovementSpeed
}

export interface Bot {
  id: number
  name: string
  health: number
  position: {
    x: number
    y: number
  }
  target: number | null
  state: 'idle' | 'moving' | 'attacking' | 'cover' | 'ability' | 'dead'
  lastAction: string
}
