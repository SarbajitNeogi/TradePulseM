import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css';

const ErrorPage: React.FC = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="home-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;