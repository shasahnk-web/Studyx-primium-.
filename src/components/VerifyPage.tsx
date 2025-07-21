import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './VerifyPage.css';

export const VerifyPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Store intended path if coming from a redirect
    if (location.state?.from) {
      localStorage.setItem('intendedPath', location.state.from.pathname);
    }
  }, [location]);

  return (
    <div className="verify-container">
      <h2>Verification Required</h2>
      <p>Please verify your access to continue browsing.</p>
      <div className="verify-info">
        <p>Steps to verify:</p>
        <ol>
          <li>Click the verification link below</li>
          <li>Complete the verification process</li>
          <li>You'll be automatically redirected to your intended destination</li>
        </ol>
      </div>
      <a 
        href="https://vplink.in/nrLwIQ" 
        className="verify-button"
        target="_blank" 
        rel="noopener noreferrer"
      >
        Click here to verify
      </a>
    </div>
  );
};
