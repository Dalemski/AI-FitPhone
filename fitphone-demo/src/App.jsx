import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { predictSleepQuality } from './onnxModel';
import StepIndicator from './components/StepIndicator';
import EmojiSlider from './components/EmojiSlider';
import TimeInput from './components/TimeInput';
import ButtonGroup from './components/ButtonGroup';
import ResultsCard from './components/ResultsCard';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './components/Dashboard';
import { addToHistory } from './utils/historyStorage';

// Save/load from localStorage
const STORAGE_KEY = 'fitphone_form_data';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'assessment'
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(() => loadFromStorage() || {
    screen_time_hours: 5,
    work_screen_hours: 2,
    leisure_screen_hours: 3,
    stress_level_0_10: 5,
    productivity_0_100: 60,
    exercise_minutes_per_week: 150,
    social_hours_per_week: 5,
    age: 25,
    mental_wellness_index_0_100: 70,
    gender: 'Female',
    occupation: 'Student',
    work_mode: 'In-person',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(form);
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const isCategorical = ['gender', 'occupation', 'work_mode'].includes(name);

    setForm((prev) => ({
      ...prev,
      [name]: isCategorical ? value : Number(value),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictSleepQuality(form);
      setPrediction(result);
      // Save to history
      addToHistory(result, form);
      setCurrentStep(5); // Move to results step
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Failed to predict sleep quality. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
    setCurrentStep(1);
    setLoading(false);
  };

  const startAssessment = () => {
    setView('assessment');
    setCurrentStep(1);
    setPrediction(null);
    setError(null);
  };

  const goToDashboard = () => {
    setView('dashboard');
    setCurrentStep(1);
    setPrediction(null);
    setError(null);
  };

  const nextStep = (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  
  const prevStep = (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const stepTitles = [
    'Your Phone Habits',
    'How You Feel',
    'Your Lifestyle',
    'About You',
    'Your Results'
  ];

  return view === 'assessment' ? (
    <div className="app-root">
      <div className="phone-frame">
        {/* Notch */}
        <div className="phone-notch">
          <div className="notch-speaker" />
          <div className="notch-camera" />
        </div>

        {/* Inner screen */}
        <div className="phone-inner">
          {/* Header / hero */}
          <header className="phone-header">
            <div className="status-bar">
              <span className="status-time">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </span>
              <div className="status-icons">
                <span className="status-dot" />
                <span className="status-bar-icon" />
                <span className="status-bar-icon wide" />
              </div>
            </div>

            <div className="hero">
              <div className="hero-title">
                <h1>Better Sleep</h1>
                <span>by FitPhone</span>
              </div>
              {currentStep === 1 ? (
                <div className="hero-disclaimer">
                  <p className="hero-pill">
                    ℹ️ For guidance only
                  </p>
                  <p className="disclaimer-text">
                    This assessment is for general guidance. Many factors affect sleep quality, including medical conditions. Consult a healthcare professional for personalized advice.
                  </p>
                </div>
              ) : (
                <p className="hero-pill">
                  {currentStep < 5 
                    ? 'Answer honestly for accurate results' 
                    : 'Your personalized sleep assessment'}
                </p>
              )}
            </div>
          </header>

          {/* Scrollable content */}
          <main className="phone-content">
            <form onSubmit={handleSubmit} className="demo-form">
              {currentStep < 5 && (
                <StepIndicator 
                  currentStep={currentStep} 
                  totalSteps={4} 
                  stepTitles={stepTitles}
                />
              )}

              {/* Step 1: Phone Habits */}
              {currentStep === 1 && (
                <section className="section step-section">
                  <h2 className="section-title">📱 Your Phone Habits</h2>
                  <p className="section-description">
                    How much time do you spend on your phone each day?
                  </p>
                  
                  <div className="field-stack">
                    <TimeInput
                      label="Total screen time per day"
                      name="screen_time_hours"
                      value={form.screen_time_hours}
                      onChange={handleChange}
                      max={24}
                    />

                    <div className="split-inputs">
                      <TimeInput
                        label="Work/Study"
                        name="work_screen_hours"
                        value={form.work_screen_hours}
                        onChange={handleChange}
                        max={form.screen_time_hours}
                      />
                      <TimeInput
                        label="Leisure/Social"
                        name="leisure_screen_hours"
                        value={form.leisure_screen_hours}
                        onChange={handleChange}
                        max={form.screen_time_hours}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Step 2: How You Feel */}
              {currentStep === 2 && (
                <section className="section step-section">
                  <h2 className="section-title">💭 How You Feel</h2>
                  <p className="section-description">
                    Let's understand your current state of mind
                  </p>
                  
                  <div className="field-stack">
                    <div className="field">
                      <label htmlFor="stress_level_0_10">How stressed are you right now?</label>
                      <EmojiSlider
                        name="stress_level_0_10"
                        value={form.stress_level_0_10}
                        onChange={handleChange}
                        min={0}
                        max={10}
                        step={1}
                        emojis={['😌', '🙂', '😐', '😟', '😰']}
                        labels={['Calm', 'Overwhelmed']}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="productivity_0_100">How productive did you feel today?</label>
                      <EmojiSlider
                        name="productivity_0_100"
                        value={form.productivity_0_100}
                        onChange={handleChange}
                        min={0}
                        max={100}
                        step={1}
                        emojis={['😫', '😕', '😐', '🙂', '🔥']}
                        labels={['Struggled', 'Crushed it']}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="mental_wellness_index_0_100">How's your mood lately?</label>
                      <EmojiSlider
                        name="mental_wellness_index_0_100"
                        value={form.mental_wellness_index_0_100}
                        onChange={handleChange}
                        min={0}
                        max={100}
                        step={1}
                        emojis={['😢', '😞', '😐', '😊', '🌟']}
                        labels={['Not great', 'Amazing']}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Step 3: Lifestyle */}
              {currentStep === 3 && (
                <section className="section step-section">
                  <h2 className="section-title">🏃‍♂️ Your Lifestyle</h2>
                  <p className="section-description">
                    Tell us about your physical activity and social life
                  </p>
                  
                  <div className="field-stack">
                    <div className="field">
                      <label htmlFor="exercise_minutes_per_week">
                        How much do you exercise per week?
                      </label>
                      <ButtonGroup
                        name="exercise_minutes_per_week"
                        value={form.exercise_minutes_per_week}
                        onChange={handleChange}
                        options={[
                          { value: 0, label: 'No exercise', icon: '💤' },
                          { value: 60, label: 'Light (1h/week)', icon: '🚶‍♂️' },
                          { value: 150, label: 'Moderate (2-3h/week)', icon: '🏃‍♂️' },
                          { value: 300, label: 'Active (4-5h/week)', icon: '💪' },
                          { value: 500, label: 'Very active (7+h/week)', icon: '🏋️‍♂️' },
                        ]}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="social_hours_per_week">
                        How much time do you spend socializing in-person weekly?
                      </label>
                      <ButtonGroup
                        name="social_hours_per_week"
                        value={form.social_hours_per_week}
                        onChange={handleChange}
                        options={[
                          { value: 0, label: 'Rarely/Never', icon: '🏠' },
                          { value: 2, label: 'A few hours', icon: '👋' },
                          { value: 5, label: 'Several hours', icon: '👥' },
                          { value: 10, label: 'Quite often', icon: '🎉' },
                          { value: 20, label: 'Very social', icon: '🎊' },
                        ]}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Step 4: About You */}
              {currentStep === 4 && (
                <section className="section step-section">
                  <h2 className="section-title">👤 About You</h2>
                  <p className="section-description">
                    Just a few more details to personalize your results
                  </p>
                  
                  <div className="field-stack">
                    <div className="field">
                      <label htmlFor="age">What's your age?</label>
                      <div className="number-input-wrapper">
                        <input
                          id="age"
                          type="number"
                          name="age"
                          value={form.age}
                          onChange={handleChange}
                          min="13"
                          max="100"
                          className="number-input-large"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="gender">Gender</label>
                      <ButtonGroup
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        options={[
                          { value: 'Female', label: 'Female', icon: '♀️' },
                          { value: 'Male', label: 'Male', icon: '♂️' },
                          { value: 'Non-binary/Other', label: 'Non-binary/Other', icon: '⚧' },
                        ]}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="occupation">What's your occupation?</label>
                      <ButtonGroup
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        options={[
                          { value: 'Student', label: 'Student', icon: '📚' },
                          { value: 'Employed', label: 'Employed', icon: '💼' },
                          { value: 'Self-employed', label: 'Self-employed', icon: '🚀' },
                          { value: 'Unemployed', label: 'Unemployed', icon: '🔍' },
                          { value: 'Retired', label: 'Retired', icon: '🌴' },
                        ]}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="work_mode">Work mode</label>
                      <ButtonGroup
                        name="work_mode"
                        value={form.work_mode}
                        onChange={handleChange}
                        options={[
                          { value: 'Remote', label: 'Remote', icon: '🏠' },
                          { value: 'Hybrid', label: 'Hybrid', icon: '🔄' },
                          { value: 'In-person', label: 'In-person', icon: '🏢' },
                        ]}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Step 5: Results */}
              {currentStep === 5 && (
                <section className="section step-section">
                  {loading ? (
                    <LoadingSpinner message="Analyzing your sleep patterns..." />
                  ) : error ? (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      <p>{error}</p>
                      <button 
                        type="button" 
                        className="secondary-button"
                        onClick={() => setCurrentStep(4)}
                      >
                        Go Back
                      </button>
                    </div>
                  ) : (
                    <ResultsCard 
                      prediction={prediction} 
                      formData={form}
                      onReset={handleReset}
                      onViewDashboard={goToDashboard}
                    />
                  )}
                </section>
              )}

              {/* Navigation Buttons */}
              {currentStep < 5 && !loading && (
                <div className="step-navigation">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>
                  )}
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={nextStep}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={loading}
                    >
                      {loading ? 'Analyzing...' : 'Get My Results ✨'}
                    </button>
                  )}
                </div>
              )}
            </form>
          </main>
        </div>

        {/* Home indicator */}
        <div className="home-indicator-wrapper">
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  ) : (
    // Dashboard View
    <div className="app-container">
      <div className="phone-frame">
        <div className="phone-notch" />
        
        <div className="phone-screen">
          <header className="status-bar">
            <span className="status-time">{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            <div className="status-icons">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </header>

          <main className="phone-content">
            <Dashboard onStartAssessment={startAssessment} />
          </main>
        </div>

        {/* Home indicator */}
        <div className="home-indicator-wrapper">
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  );
}

export default App;
