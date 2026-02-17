import { useState } from 'react';
import './EmojiSlider.css';

/**
 * Visual slider with emoji anchors for intuitive rating input
 */
export default function EmojiSlider({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  emojis = ['😫', '😐', '🙂', '😊', '🔥'],
  labels = [],
  name 
}) {
  const [isDragging, setIsDragging] = useState(false);

  const emojiPositions = emojis.map((_, index) => 
    min + (index / (emojis.length - 1)) * (max - min)
  );

  const getEmojiForValue = (val) => {
    const index = Math.round((val - min) / (max - min) * (emojis.length - 1));
    return emojis[Math.max(0, Math.min(index, emojis.length - 1))];
  };

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div className={`emoji-slider ${isDragging ? 'dragging' : ''}`}>
      <div className="emoji-display">
        <span className="emoji-large">{getEmojiForValue(value)}</span>
      </div>
      
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="slider-input"
        />
        <div className="emoji-markers">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              className={`emoji-marker ${Math.abs(value - emojiPositions[index]) < step * 2 ? 'active' : ''}`}
              onClick={() => onChange({ target: { name, value: emojiPositions[index] } })}
              style={{ left: `${(index / (emojis.length - 1)) * 100}%` }}
              aria-label={labels[index] || emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {labels.length > 0 && (
        <div className="slider-labels">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
