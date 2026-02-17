import './StepIndicator.css';

/**
 * Step indicator showing progress through multi-step questionnaire
 */
export default function StepIndicator({ currentStep, totalSteps, stepTitles }) {
  return (
    <div className="step-indicator">
      <div className="step-progress-bar">
        <div 
          className="step-progress-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="step-info">
        <span className="step-current">Step {currentStep} of {totalSteps}</span>
        {stepTitles && stepTitles[currentStep - 1] && (
          <span className="step-title">{stepTitles[currentStep - 1]}</span>
        )}
      </div>
    </div>
  );
}
