'use client'

import { useState, useEffect } from 'react'
import ModOptions from './components/ModOptions'
import BotSimulation from './components/BotSimulation'
import { BotConfig, Bot } from './types'

export default function Home() {
  const [config, setConfig] = useState<BotConfig>({
    damageMultiplier: 1,
    movementSpeed: 'Standard'
  })

  const [bots, setBots] = useState<Bot[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    initializeBots()
  }, [config])

  const initializeBots = () => {
    const newBots: Bot[] = Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      name: `Bot ${i + 1}`,
      health: 100,
      position: {
        x: Math.random() * 700 + 50,
        y: Math.random() * 400 + 50
      },
      target: null,
      state: 'idle',
      lastAction: 'Spawned'
    }))
    setBots(newBots)
  }

  const getSpeedMultiplier = () => {
    switch (config.movementSpeed) {
      case 'Fast': return 1.5
      case 'Very Fast': return 2.5
      default: return 1
    }
  }

  const updateBotAI = () => {
    setBots(prevBots => {
      return prevBots.map(bot => {
        if (bot.health <= 0) {
          return { ...bot, state: 'dead', lastAction: 'Eliminated' }
        }

        const otherBots = prevBots.filter(b => b.id !== bot.id && b.health > 0)

        // AI Decision Making
        const newBot = { ...bot }
        const baseSpeed = 2 * getSpeedMultiplier()

        // Target prioritization
        if (!newBot.target || Math.random() > 0.95) {
          const closestEnemy = otherBots.reduce((closest, current) => {
            const distToCurrent = Math.hypot(
              current.position.x - bot.position.x,
              current.position.y - bot.position.y
            )
            const distToClosest = closest ? Math.hypot(
              closest.position.x - bot.position.x,
              closest.position.y - bot.position.y
            ) : Infinity
            return distToCurrent < distToClosest ? current : closest
          }, null as Bot | null)

          newBot.target = closestEnemy?.id || null
        }

        const target = otherBots.find(b => b.id === newBot.target)

        if (target) {
          const dx = target.position.x - newBot.position.x
          const dy = target.position.y - newBot.position.y
          const distance = Math.hypot(dx, dy)

          // Movement AI
          if (distance > 150) {
            // Approach target
            newBot.position.x += (dx / distance) * baseSpeed
            newBot.position.y += (dy / distance) * baseSpeed
            newBot.state = 'moving'
            newBot.lastAction = `Moving to ${target.name}`
          } else if (distance > 100) {
            // Cover fire position
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5
            newBot.position.x += Math.cos(angle) * baseSpeed * 0.5
            newBot.position.y += Math.sin(angle) * baseSpeed * 0.5
            newBot.state = 'cover'
            newBot.lastAction = `Taking cover, engaging ${target.name}`
          } else {
            // Attack range
            if (Math.random() > 0.7) {
              newBot.state = 'attacking'
              newBot.lastAction = `Attacking ${target.name} (${config.damageMultiplier}x damage)`

              // Deal damage to target
              const damageDealt = (5 + Math.random() * 10) * config.damageMultiplier
              setBots(prev => prev.map(b =>
                b.id === target.id
                  ? { ...b, health: Math.max(0, b.health - damageDealt) }
                  : b
              ))
            } else {
              // Strategic ability use
              if (Math.random() > 0.8) {
                newBot.state = 'ability'
                newBot.lastAction = `Using tactical ability on ${target.name}`
              }
            }
          }
        } else {
          // Patrol behavior
          if (Math.random() > 0.95) {
            newBot.position.x += (Math.random() - 0.5) * baseSpeed * 2
            newBot.position.y += (Math.random() - 0.5) * baseSpeed * 2
          }
          newBot.state = 'idle'
          newBot.lastAction = 'Scanning for targets'
        }

        // Keep bots in bounds
        newBot.position.x = Math.max(20, Math.min(780, newBot.position.x))
        newBot.position.y = Math.max(20, Math.min(480, newBot.position.y))

        return newBot
      })
    })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSimulating) {
      interval = setInterval(updateBotAI, 100)
    }
    return () => clearInterval(interval)
  }, [isSimulating, config])

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>SmartTeammates</h1>
          <p style={styles.subtitle}>by Skyline</p>
        </header>

        <div style={styles.content}>
          <div style={styles.leftPanel}>
            <ModOptions config={config} setConfig={setConfig} />

            <div style={styles.controlPanel}>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                style={{
                  ...styles.button,
                  ...(isSimulating ? styles.buttonStop : styles.buttonStart)
                }}
              >
                {isSimulating ? '⏸ Pause Simulation' : '▶ Start Simulation'}
              </button>

              <button
                onClick={initializeBots}
                style={styles.button}
              >
                🔄 Reset Bots
              </button>
            </div>

            <div style={styles.statsPanel}>
              <h3 style={styles.statsTitle}>Bot Status</h3>
              {bots.map(bot => (
                <div key={bot.id} style={styles.statItem}>
                  <div style={styles.statHeader}>
                    <span style={{
                      ...styles.botName,
                      color: bot.health > 0 ? '#4ade80' : '#ef4444'
                    }}>
                      {bot.name}
                    </span>
                    <span style={styles.healthText}>{Math.round(bot.health)}%</span>
                  </div>
                  <div style={styles.healthBar}>
                    <div style={{
                      ...styles.healthFill,
                      width: `${bot.health}%`,
                      backgroundColor: bot.health > 60 ? '#4ade80' :
                                      bot.health > 30 ? '#fbbf24' : '#ef4444'
                    }} />
                  </div>
                  <div style={styles.actionText}>{bot.lastAction}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.rightPanel}>
            <BotSimulation bots={bots} config={config} />
          </div>
        </div>

        <footer style={styles.footer}>
          <p>SmartTeammates Mod v1.0 - Advanced AI Logic System</p>
          <p style={styles.footerSmall}>
            Features: Intelligent Navigation • Target Prioritization • Cover Fire • Strategic Abilities
          </p>
        </footer>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    padding: '20px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: 'white',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '20px',
    opacity: 0.9,
  },
  content: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  leftPanel: {
    flex: '0 0 400px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  rightPanel: {
    flex: 1,
  },
  controlPanel: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  buttonStart: {
    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    color: 'white',
  },
  buttonStop: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: 'white',
  },
  statsPanel: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  statsTitle: {
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  statItem: {
    marginBottom: '15px',
    padding: '10px',
    background: '#f3f4f6',
    borderRadius: '8px',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  botName: {
    fontWeight: 'bold',
  },
  healthText: {
    fontSize: '14px',
    color: '#666',
  },
  healthBar: {
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  healthFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  actionText: {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    textAlign: 'center' as const,
    color: 'white',
    opacity: 0.9,
  },
  footerSmall: {
    fontSize: '14px',
    marginTop: '5px',
  },
}
