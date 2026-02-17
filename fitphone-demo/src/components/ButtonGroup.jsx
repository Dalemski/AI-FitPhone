import './ButtonGroup.css';

/**
 * Button group for multiple choice selections
 */
export default function ButtonGroup({ options, value, onChange, name }) {
  return (
    <div className="button-group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`button-group-item ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange({ target: { name, value: option.value } })}
          aria-pressed={value === option.value}
        >
          {option.icon && <span className="button-icon">{option.icon}</span>}
          <span className="button-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
