import './TimeInput.css';

/**
 * Time input with hour/minute selection for screen time
 */
export default function TimeInput({ value, onChange, name, label, max = 24 }) {
  // Handle NaN and invalid values
  const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
  const hours = Math.floor(safeValue);
  const minutes = Math.round((safeValue - hours) * 60);

  const handleHoursChange = (newHours) => {
    const parsedHours = parseFloat(newHours);
    // Allow empty input (treats as 0)
    const validHours = isNaN(parsedHours) ? 0 : parsedHours;
    const totalHours = validHours + (minutes / 60);
    onChange({ target: { name, value: totalHours } });
  };

  const handleMinutesChange = (newMinutes) => {
    const parsedMinutes = parseFloat(newMinutes);
    // Allow empty input (treats as 0)
    const validMinutes = isNaN(parsedMinutes) ? 0 : parsedMinutes;
    const totalHours = hours + (validMinutes / 60);
    onChange({ target: { name, value: totalHours } });
  };

  return (
    <div className="time-input">
      {label && <label className="time-label">{label}</label>}
      <div className="time-input-container">
        <div className="time-segment">
          <input
            type="number"
            min="0"
            max={max}
            value={hours || ''}
            onChange={(e) => handleHoursChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="time-value"
            aria-label={`${label} hours`}
            placeholder="0"
          />
          <span className="time-unit">h</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-segment">
          <input
            type="number"
            min="0"
            max="59"
            step="15"
            value={minutes || ''}
            onChange={(e) => handleMinutesChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="time-value"
            aria-label={`${label} minutes`}
            placeholder="0"
          />
          <span className="time-unit">m</span>
        </div>
      </div>
    </div>
  );
}
