import React from 'react';

export const VerifyPage = () => {
  return (
    <div className="verify-container">
      <h2>Verification Required</h2>
      <p>Please use the verification link to access this page.</p>
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
