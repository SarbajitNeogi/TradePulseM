import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
          <FaGithub size={24} />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
          <FaTwitter size={24} />
        </a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
          <FaLinkedin size={24} />
        </a>
      </div>
      <p className="footer-text">© {new Date().getFullYear()} TradePulse Pvt Ltd. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
