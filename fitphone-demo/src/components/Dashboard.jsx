import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getHistory, getStatistics, clearHistory } from '../utils/historyStorage';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SLEEP_QUALITY_LABELS = {
  5: 'Excellent',
  4: 'Good',
  3: 'Fair',
  2: 'Poor',
  1: 'Very Poor'
};

const SLEEP_QUALITY_EMOJIS = {
  5: '😴',
  4: '😊',
  3: '😐',
  2: '😟',
  1: '😫'
};

function Dashboard({ onStartAssessment }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHistory(getHistory());
    setStats(getStatistics());
  };

  const handleClearHistory = () => {
    clearHistory();
    loadData();
    setShowClearConfirm(false);
  };

  // Prepare chart data
  const chartData = {
    labels: history.map(h => {
      const date = new Date(h.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Sleep Quality',
        data: history.map(h => h.prediction),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `${SLEEP_QUALITY_LABELS[value]} (${value})`;
          }
        }
      }
    },
    scales: {
      y: {
        reverse: false, // Higher numbers are better
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return SLEEP_QUALITY_LABELS[value];
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const getTrendIcon = () => {
    if (stats.trend === 'improving') return '📈';
    if (stats.trend === 'declining') return '📉';
    return '➡️';
  };

  const getTrendText = () => {
    if (stats.trend === 'improving') return 'Improving';
    if (stats.trend === 'declining') return 'Needs Attention';
    return 'Stable';
  };

  const getTrendClass = () => {
    if (stats.trend === 'improving') return 'trend-good';
    if (stats.trend === 'declining') return 'trend-bad';
    return 'trend-neutral';
  };

  if (history.length === 0) {
    return (
      <div className="dashboard empty-state">
        <div className="empty-icon">📊</div>
        <h2>No Assessment History</h2>
        <p>Take your first sleep quality assessment to start tracking your progress.</p>
        <button className="btn-primary" onClick={onStartAssessment}>
          Take Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Sleep Journey</h1>
        <p>Track your sleep quality predictions over time</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Assessments</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.average}</div>
          <div className="stat-label">Average Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">{SLEEP_QUALITY_EMOJIS[stats.best]}</div>
          <div className="stat-value">{SLEEP_QUALITY_LABELS[stats.best]}</div>
          <div className="stat-label">Best Result</div>
        </div>

        <div className={`stat-card ${getTrendClass()}`}>
          <div className="stat-icon">{getTrendIcon()}</div>
          <div className="stat-value">{getTrendText()}</div>
          <div className="stat-label">Trend</div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Sleep Quality Over Time</h2>
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="recent-assessments">
        <h2>Recent Assessments</h2>
        <div className="assessment-list">
          {history.slice(-5).reverse().map(entry => {
            const date = new Date(entry.date);
            return (
              <div key={entry.id} className="assessment-item">
                <div className="assessment-emoji">
                  {SLEEP_QUALITY_EMOJIS[entry.prediction]}
                </div>
                <div className="assessment-info">
                  <div className="assessment-quality">
                    {SLEEP_QUALITY_LABELS[entry.prediction]}
                  </div>
                  <div className="assessment-date">
                    {date.toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="assessment-score">
                  {entry.prediction}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="btn-primary" onClick={onStartAssessment}>
          Take New Assessment
        </button>
        
        {!showClearConfirm ? (
          <button 
            className="btn-secondary" 
            onClick={() => setShowClearConfirm(true)}
          >
            Clear History
          </button>
        ) : (
          <div className="clear-confirm">
            <p>Are you sure? This cannot be undone.</p>
            <button className="btn-danger" onClick={handleClearHistory}>
              Yes, Clear All
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
