import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const VerificationHandler = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkReferrer = () => {
      const referrer = document.referrer;
      
      // Check if user came from vplink.in
      if (referrer.includes('vplink.in')) {
        // Set verification cookie
        document.cookie = `verified=true;max-age=${24 * 60 * 60};path=/;secure;samesite=strict`;
        navigate('/dashboard');
      } else {
        // If accessed directly, redirect to verification page
        navigate('/verify');
      }
      setIsLoading(false);
    };

    checkReferrer();
  }, [navigate]);

  if (isLoading) {
    return <div>Verifying your access...</div>;
  }

  return null;
};
