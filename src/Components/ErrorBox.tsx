import React from 'react';
import './ErrorBox.css';

interface ErrorBoxProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ errorMessage, onClose }) => {
  return (
    <div className="error-box">
      <span className="close-icon" onClick={onClose}>×</span>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorBox;
