import './ResultsCard.css';

const SLEEP_QUALITY_CONFIG = {
  5: {
    emoji: '✨',
    label: 'Excellent',
    color: '#10b981',
    message: 'Amazing! Your predicted sleep quality is excellent.',
    tips: []
  },
  4: {
    emoji: '😊',
    label: 'Good',
    color: '#3b82f6',
    message: 'Great job! Your predicted sleep quality is good.',
    tips: []
  },
  3: {
    emoji: '😐',
    label: 'Fair',
    color: '#f59e0b',
    message: 'Your predicted sleep quality is fair. Small improvements could help.',
    tips: []
  },
  2: {
    emoji: '😴',
    label: 'Poor',
    color: '#ef4444',
    message: 'Your predicted sleep quality needs attention.',
    tips: []
  },
  1: {
    emoji: '😰',
    label: 'Very Poor',
    color: '#dc2626',
    message: 'Your predicted sleep quality needs significant improvement.',
    tips: []
  }
};

/**
 * Get personalized tips based on form inputs
 */
function getPersonalizedTips(prediction, formData) {
  const tips = [];
  
  if (formData.screen_time_hours > 6) {
    tips.push('🔵 Try reducing your total screen time to under 6 hours daily');
  }
  
  if (formData.leisure_screen_hours > 3) {
    tips.push('📱 Limit leisure screen time, especially 2 hours before bed');
  }
  
  if (formData.stress_level_0_10 > 6) {
    tips.push('😌 High stress affects sleep - try relaxation techniques');
  }
  
  if (formData.exercise_minutes_per_week < 150) {
    tips.push('🏃‍♂️ Aim for 150+ minutes of exercise per week');
  }
  
  if (formData.social_hours_per_week < 3) {
    tips.push('👥 Social connection improves wellbeing and sleep');
  }
  
  if (formData.mental_wellness_index_0_100 < 60) {
    tips.push('💚 Consider speaking with a mental health professional');
  }

  return tips;
}

/**
 * Results card showing sleep quality prediction and insights
 */
export default function ResultsCard({ prediction, formData, onReset, onViewDashboard }) {
  if (prediction === null) return null;

  const config = SLEEP_QUALITY_CONFIG[prediction] || SLEEP_QUALITY_CONFIG[3];
  const tips = getPersonalizedTips(prediction, formData);

  return (
    <div className="results-card" style={{ '--accent-color': config.color }}>
      <div className="results-header">
        <div className="results-emoji">{config.emoji}</div>
        <h3 className="results-label">{config.label}</h3>
        <p className="results-message">{config.message}</p>
        <div className="sleep-scale-explanation">
          <p className="scale-title">Sleep Quality Scale:</p>
          <p className="scale-description">
            ✨ Excellent (1) • 😊 Good (2) • 😐 Fair (3) • 😴 Poor (4) • 😰 Very Poor (5)
          </p>
        </div>
      </div>

      {tips.length > 0 && (
        <div className="results-tips">
          <h4 className="tips-title">💡 Personalized Tips</h4>
          <ul className="tips-list">
            {tips.map((tip, index) => (
              <li key={index} className="tip-item">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="results-metrics">
        <div className="metric-item">
          <span className="metric-label">Screen Time</span>
          <span className="metric-value">{formData.screen_time_hours}h</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Stress Level</span>
          <span className="metric-value">{formData.stress_level_0_10}/10</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Exercise</span>
          <span className="metric-value">{formData.exercise_minutes_per_week}min/week</span>
        </div>
      </div>

      <div className="results-actions">
        <button 
          type="button" 
          className="results-dashboard-btn"
          onClick={onViewDashboard}
        >
          📊 View Dashboard
        </button>
        <button 
          type="button" 
          className="results-reset-btn"
          onClick={onReset}
        >
          Take Assessment Again
        </button>
      </div>
    </div>
  );
}
