import { BotConfig, MovementSpeed } from '../types'

interface ModOptionsProps {
  config: BotConfig
  setConfig: (config: BotConfig) => void
}

export default function ModOptions({ config, setConfig }: ModOptionsProps) {
  const handleDamageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      damageMultiplier: parseFloat(e.target.value)
    })
  }

  const handleSpeedChange = (speed: MovementSpeed) => {
    setConfig({
      ...config,
      movementSpeed: speed
    })
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚙️ Mod Options</h2>

      <div style={styles.section}>
        <div style={styles.labelRow}>
          <label style={styles.label}>Damage Multiplier</label>
          <span style={styles.value}>{config.damageMultiplier.toFixed(1)}x</span>
        </div>

        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={config.damageMultiplier}
          onChange={handleDamageChange}
          style={styles.slider}
        />

        <div style={styles.scaleLabels}>
          <span>1x</span>
          <span>2x</span>
          <span>3x</span>
          <span>4x</span>
          <span>5x</span>
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Movement Speed</label>

        <div style={styles.buttonGroup}>
          {(['Standard', 'Fast', 'Very Fast'] as MovementSpeed[]).map(speed => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              style={{
                ...styles.speedButton,
                ...(config.movementSpeed === speed ? styles.speedButtonActive : {})
              }}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>🤖 AI Features</h3>
        <ul style={styles.featureList}>
          <li>✓ Intelligent pathfinding & navigation</li>
          <li>✓ Dynamic target prioritization</li>
          <li>✓ Cover fire & tactical positioning</li>
          <li>✓ Strategic ability usage</li>
          <li>✓ Real-time decision making</li>
        </ul>
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
  },
  section: {
    marginBottom: '25px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
    background: 'linear-gradient(to right, #e5e7eb, #7c3aed)',
    cursor: 'pointer',
  },
  scaleLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '12px',
    color: '#6b7280',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  speedButton: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  speedButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderColor: '#764ba2',
  },
  infoBox: {
    background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '20px',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#581c87',
  },
  featureList: {
    listStyle: 'none',
    fontSize: '14px',
    color: '#6b21a8',
    lineHeight: '1.8',
  },
}
