import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const PreHomepage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  const serverLink = 'https://reel2earn.com/xlPui0Mc';
  const tutorialLink = 'https://t.me/studyx_1';
  const accessDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    checkAccessStatus();
    initializeParticles();
    loadGoogleFonts();

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);

  let interval: NodeJS.Timeout;

  const checkAccessStatus = () => {
    const accessTime = localStorage.getItem('accessTime');
    if (!accessTime) return;

    const now = new Date().getTime();
    const elapsed = now - parseInt(accessTime);
    
    if (elapsed < accessDuration) {
      // Access still valid
      setHasAccess(true);
      startTimer(accessDuration - elapsed);
    } else {
      // Access expired
      localStorage.removeItem('accessTime');
      setSessionExpired(true);
    }
  };

  const startTimer = (duration: number) => {
    let remaining = duration;
    
    interval = setInterval(() => {
      remaining -= 1000;
      
      if (remaining <= 0) {
        clearInterval(interval);
        handleSessionExpiry();
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
  };

  const handleSessionExpiry = () => {
    localStorage.removeItem('accessTime');
    setHasAccess(false);
    setSessionExpired(true);
    router.replace('/pre-homepage'); // Redirect to pre-homepage
  };

  const initializeParticles = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      if (window.particlesJS) {
        window.particlesJS("particles-js", {
          particles: { 
            number: { value: 100, density: { enable: true, value_area: 800 }},
            color: { value: "#00bcd4" }, 
            shape: { type: "circle" },
            opacity: { value: 0.5, anim: { enable: true, speed: 1, opacity_min: 0.1 }},
            size: { value: 2.5, random: true },
            line_linked: { enable: true, distance: 140, color: "#00bcd4", opacity: 0.3, width: 1 },
            move: { enable: true, speed: 1.5, out_mode: "out" }
          },
          interactivity: { 
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }},
            modes: { grab: { distance: 120, line_linked: { opacity: 1 }}}
          }, 
          retina_detect: true
        });
      }
    };
    document.head.appendChild(script);
  };

  const loadGoogleFonts = () => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  };

  const handleGenerateAccess = () => {
    setLoading(true);
    
    // Simulate API call to backend to start timer
    setTimeout(() => {
      const now = new Date().getTime();
      localStorage.setItem('accessTime', now.toString());
      
      // Also send to backend (in a real app, this would be an API call)
      // backendStartTimer(now);
      
      setHasAccess(true);
      setLoading(false);
      startTimer(accessDuration);
      window.location.href = serverLink;
    }, 1500);
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    color: '#ffffff',
    border: '1px solid #00bcd4',
    background: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '8px 0',
    fontWeight: '600',
    transition: 'all 0.3s',
    textTransform: 'uppercase'
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      color: '#fff',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Poppins, sans-serif',
      background: '#0a0f1d'
    }}>
      <div id="particles-js" style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1
      }}></div>
      
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '15px',
        padding: '30px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 0 15px rgba(0,174,255,0.3)',
        border: '1px solid rgba(0,174,255,0.2)',
        backdropFilter: 'blur(8px)'
      }}>
        <h2 style={{ 
          color: '#a3f7ff', 
          textShadow: '0 0 10px rgba(0,234,255,0.5)',
          marginBottom: '20px',
          fontSize: '24px'
        }}>
          {sessionExpired ? 'Session Expired' : hasAccess ? 'Access Granted' : 'Generate Access Key'}
        </h2>
        
        <p style={{ 
          color: '#d4eaff', 
          marginBottom: '20px', 
          fontSize: '14px' 
        }}>
          {sessionExpired 
            ? 'Your 24-hour access has expired. Please generate a new key.'
            : hasAccess
              ? 'You have active access to the website'
              : 'Generate your 24-hour access key'}
        </p>

        {timeLeft && (
          <p style={{ 
            color: '#ffcb6b',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Time remaining: {timeLeft}
          </p>
        )}

        <button
          onClick={hasAccess ? () => window.location.href = serverLink : handleGenerateAccess}
          style={buttonStyle}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.background = '#00bcd4';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,188,212,0.6)';
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = 'none';
          }}
          disabled={loading}
        >
          {loading ? 'Generating...' : hasAccess ? 'Access Website' : 'Generate Access Key'}
        </button>
        
        <button
          onClick={() => window.open(tutorialLink, '_blank')}
          style={{
            ...buttonStyle,
            borderColor: '#ffcb6b',
            color: '#ffcb6b'
          }}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.background = '#ffcb6b';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255,203,107,0.6)';
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ffcb6b';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          TUTORIAL VIDEO [EASY METHOD]
        </button>
        
        {loading && (
          <p style={{ 
            fontSize: '13px',
            color: '#ffcb6b',
            marginTop: '10px',
            animation: 'flicker 1.5s infinite alternate'
          }}>
            Generating access, please wait...
          </p>
        )}
      </div>

      <style>{`
        @keyframes flicker {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PreHomepage;
