import React from 'react';
import './ErrorBox.css';

interface props {
  Message: string;
  onClose: () => void;
}

const Notify: React.FC<props> = ({ Message, onClose }) => {
  return (
    <div className="notify-box">
      <span className="notify-close-icon" onClick={onClose}>×</span>
      <p>{Message}</p>
    </div>
  );
};

export default Notify;
