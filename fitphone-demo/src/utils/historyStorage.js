// History storage utilities for localStorage
const HISTORY_KEY = 'fitphone_prediction_history';

/**
 * Get all prediction history
 * @returns {Array} Array of prediction objects
 */
export function getHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Add a new prediction to history
 * @param {number} prediction - Sleep quality rating (1-5)
 * @param {Object} formData - Form data used for prediction
 */
export function addToHistory(prediction, formData) {
  try {
    const history = getHistory();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      prediction,
      formData: { ...formData }
    };
    
    history.push(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return entry;
  } catch (error) {
    console.error('Failed to save to history:', error);
    return null;
  }
}

/**
 * Delete a specific prediction from history
 * @param {number} id - Entry ID to delete
 */
export function deleteFromHistory(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete from history:', error);
    return false;
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}

/**
 * Get statistics from history
 * @returns {Object} Statistics object
 */
export function getStatistics() {
  const history = getHistory();
  
  if (history.length === 0) {
    return {
      total: 0,
      average: 0,
      best: null,
      worst: null,
      trend: 'no-data'
    };
  }

  const predictions = history.map(h => h.prediction);
  const average = predictions.reduce((sum, p) => sum + p, 0) / predictions.length;
  const best = Math.max(...predictions); // Higher is better (5 is best sleep quality)
  const worst = Math.min(...predictions);
  
  // Calculate trend (comparing last 3 vs previous entries)
  let trend = 'stable';
  if (history.length >= 4) {
    const recent = predictions.slice(-3).reduce((sum, p) => sum + p, 0) / 3;
    const previous = predictions.slice(0, -3).reduce((sum, p) => sum + p, 0) / (predictions.length - 3);
    
    if (recent > previous + 0.3) trend = 'improving'; // Higher score is better
    else if (recent < previous - 0.3) trend = 'declining';
  }

  return {
    total: history.length,
    average: parseFloat(average.toFixed(2)),
    best,
    worst,
    trend,
    firstDate: history[0].date,
    lastDate: history[history.length - 1].date
  };
}
