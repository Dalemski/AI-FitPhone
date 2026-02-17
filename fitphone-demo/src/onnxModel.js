// API endpoint - update this after deploying backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Predict sleep quality using backend API
 * @param {Object} input - Form data with all 12 fields
 * @returns {Promise<number>} Sleep quality rating (1-5)
 */
export async function predictSleepQuality(input) {
  try {
    console.log('Sending prediction request to:', `${API_URL}/predict`);
    
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Prediction result:', result);
    
    return result.sleep_quality;
    
  } catch (error) {
    console.error('❌ Prediction failed:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to prediction service. Please check your internet connection.');
    }
    
    throw new Error(error.message || 'Unable to predict sleep quality. Please try again.');
  }
}

