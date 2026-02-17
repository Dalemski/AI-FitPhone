import { useState } from 'react';
import './App.css';
import { predictSleepQuality } from './onnxModel'; // your existing helper

function App() {
  const [form, setForm] = useState({
    screen_time_hours: 5,
    work_screen_hours: 2,
    leisure_screen_hours: 3,
    stress_level_0_10: 5,
    productivity_0_100: 60,
    exercise_minutes_per_week: 60,
    social_hours_per_week: 5,
    age: 22,
    mental_wellness_index_0_100: 50,
    gender: 'Female',
    occupation: 'Student',
    work_mode: 'In-person',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isCategorical = ['gender', 'occupation', 'work_mode'].includes(name);

    setForm((prev) => ({
      ...prev,
      [name]: isCategorical ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictSleepQuality(form);
      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setPrediction('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <span className="status-time">23:55</span>
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
              <p className="hero-pill">
                Be honest, how much do you use your phone?
              </p>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="phone-content">
            <form onSubmit={handleSubmit} className="demo-form">
              {/* Tonight's phone use */}
              <section className="section">
                <h2 className="section-title">Tonight&apos;s phone use</h2>
                <div className="field-grid">
                  <div className="field">
                    <label>Screen time (h/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="screen_time_hours"
                      value={form.screen_time_hours}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Work screen (h/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="work_screen_hours"
                      value={form.work_screen_hours}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Leisure screen (h/day)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="leisure_screen_hours"
                      value={form.leisure_screen_hours}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              {/* Lifestyle & mood */}
              <section className="section">
                <h2 className="section-title">Lifestyle & mood</h2>
                <div className="field-grid">
                  <div className="field">
                    <label>Stress level (0–10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      name="stress_level_0_10"
                      value={form.stress_level_0_10}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Productivity (0–100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="productivity_0_100"
                      value={form.productivity_0_100}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Exercise (min / week)</label>
                    <input
                      type="number"
                      name="exercise_minutes_per_week"
                      value={form.exercise_minutes_per_week}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Social hours / week</label>
                    <input
                      type="number"
                      name="social_hours_per_week"
                      value={form.social_hours_per_week}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>Mental wellness (0–100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="mental_wellness_index_0_100"
                      value={form.mental_wellness_index_0_100}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              {/* About you */}
              <section className="section">
                <h2 className="section-title">About you</h2>
                <div className="field-grid">
                  <div className="field">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary/Other">
                        Non-binary/Other
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Occupation</label>
                    <select
                      name="occupation"
                      value={form.occupation}
                      onChange={handleChange}
                    >
                      <option value="Employed">Employed</option>
                      <option value="Student">Student</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Work mode</label>
                    <select
                      name="work_mode"
                      value={form.work_mode}
                      onChange={handleChange}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Predict button & result */}
              <section className="section section-bottom">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading ? 'Predicting…' : 'Predict Sleep Quality'}
                </button>

                {prediction !== null && (
                  <div className="prediction-card">
                    <span className="prediction-label">
                      Predicted sleep quality
                    </span>
                    <span className="prediction-value">
                      {prediction === 'Error' ? 'Error' : `Class ${prediction}`}
                    </span>
                    {prediction !== 'Error' && (
                      <p className="prediction-hint">
                        1 = excellent · 4 = poor
                      </p>
                    )}
                  </div>
                )}
              </section>
            </form>
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
