import { Bot, BotConfig } from '../types'

interface BotSimulationProps {
  bots: Bot[]
  config: BotConfig
}

export default function BotSimulation({ bots, config }: BotSimulationProps) {
  const getStateColor = (state: Bot['state']) => {
    switch (state) {
      case 'attacking': return '#ef4444'
      case 'moving': return '#3b82f6'
      case 'cover': return '#f59e0b'
      case 'ability': return '#8b5cf6'
      case 'dead': return '#6b7280'
      default: return '#10b981'
    }
  }

  const getStateIcon = (state: Bot['state']) => {
    switch (state) {
      case 'attacking': return '⚔️'
      case 'moving': return '🏃'
      case 'cover': return '🛡️'
      case 'ability': return '✨'
      case 'dead': return '💀'
      default: return '👁️'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Live Battle Simulation</h2>
        <div style={styles.configBadge}>
          {config.damageMultiplier}x Damage • {config.movementSpeed} Speed
        </div>
      </div>

      <div style={styles.battlefield}>
        <div style={styles.grid}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} style={{ ...styles.gridLineH, top: `${i * 10}%` }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} style={{ ...styles.gridLineV, left: `${i * 10}%` }} />
          ))}
        </div>

        {bots.map(bot => (
          <div
            key={bot.id}
            style={{
              ...styles.bot,
              left: `${bot.position.x}px`,
              top: `${bot.position.y}px`,
              borderColor: getStateColor(bot.state),
              opacity: bot.health > 0 ? 1 : 0.3,
            }}
          >
            <div style={{
              ...styles.botInner,
              background: getStateColor(bot.state),
            }}>
              <span style={styles.botIcon}>{getStateIcon(bot.state)}</span>
            </div>

            <div style={styles.botLabel}>
              {bot.name}
            </div>

            <div style={styles.healthBarSmall}>
              <div style={{
                ...styles.healthFillSmall,
                width: `${bot.health}%`,
                background: bot.health > 60 ? '#4ade80' :
                           bot.health > 30 ? '#fbbf24' : '#ef4444'
              }} />
            </div>

            {bot.target && (
              <div style={styles.targetLine} />
            )}
          </div>
        ))}

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <span style={styles.legendIcon}>👁️</span> Idle
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendIcon}>🏃</span> Moving
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendIcon}>🛡️</span> Cover
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendIcon}>⚔️</span> Attacking
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendIcon}>✨</span> Ability
          </div>
        </div>
      </div>

      <div style={styles.description}>
        <p>
          Watch as AI-controlled bots intelligently navigate the battlefield,
          prioritize targets, take cover, and execute strategic abilities in real-time.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  configBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  battlefield: {
    position: 'relative' as const,
    width: '800px',
    height: '500px',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '15px',
  },
  grid: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  gridLineH: {
    position: 'absolute' as const,
    width: '100%',
    height: '1px',
    background: '#fff',
  },
  gridLineV: {
    position: 'absolute' as const,
    width: '1px',
    height: '100%',
    background: '#fff',
  },
  bot: {
    position: 'absolute' as const,
    width: '40px',
    height: '40px',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.1s ease-out',
  },
  botInner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '3px solid rgba(255,255,255,0.3)',
  },
  botIcon: {
    fontSize: '20px',
  },
  botLabel: {
    position: 'absolute' as const,
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap' as const,
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
  healthBarSmall: {
    position: 'absolute' as const,
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '4px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  healthFillSmall: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  targetLine: {
    position: 'absolute' as const,
    width: '2px',
    height: '20px',
    background: 'red',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  legend: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.7)',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  legendItem: {
    color: 'white',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendIcon: {
    fontSize: '14px',
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
}
