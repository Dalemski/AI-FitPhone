import './LoadingSpinner.css';

/**
 * Loading spinner with optional message
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}
