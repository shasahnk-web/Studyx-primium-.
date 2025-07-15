import { useEffect, useState } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const PreHomepage = () => {
  const [cooldownMessage, setCooldownMessage] = useState('');
  const [accessExpired, setAccessExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAccessValidity();
    initializeParticles();
    loadGoogleFonts();
  }, []);

  const checkAccessValidity = () => {
    const accessTime = localStorage.getItem('accessTime');
    if (!accessTime) {
      // No previous access, allow generation
      return;
    }

    const now = new Date().getTime();
    const accessDuration = 24 * 60 * 60 * 1000; // 24 hours
    const elapsed = now - parseInt(accessTime);

    if (elapsed < accessDuration) {
      // Still within 24 hour access period
      const remaining = accessDuration - elapsed;
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      
      setCooldownMessage(`Your current access expires in ${hours}h ${Math.round(minutes)}m`);
      setTimeout(() => {
        // Automatically expire access when time is up
        setAccessExpired(true);
        setCooldownMessage('Your access has expired. Please generate a new key.');
      }, remaining);
    } else {
      // Access expired
      setAccessExpired(true);
      setCooldownMessage('Your access has expired. Please generate a new key.');
    }
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
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  };

  const loadGoogleFonts = () => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    return () => {
      if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink);
    };
  };

  const handleGenerateKey = () => {
    if (accessExpired || !localStorage.getItem('accessTime')) {
      setLoading(true);
      localStorage.setItem('accessTime', new Date().getTime().toString());
      
      setTimeout(() => {
        setLoading(false);
        setAccessExpired(false);
        window.location.href = 'https://reel2earn.com/xlPui0Mc';
      }, 1500);
    } else {
      // Direct access if within 24 hours
      window.location.href = 'https://reel2earn.com/xlPui0Mc';
    }
  };

  const handleTutorialVideo = () => {
    window.open('https://t.me/studyx_1', '_blank');
  };

  const buttonStyle = (disabled: boolean) => ({
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    color: disabled ? '#666' : '#fff',
    border: `1px solid ${disabled ? '#666' : '#00bcd4'}`,
    background: disabled ? 'transparent' : 'transparent',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    margin: '8px 0',
    fontWeight: '600',
    transition: '0.3s',
    textTransform: 'uppercase',
    opacity: disabled ? 0.6 : 1
  });

  const hoverStyle = (e: React.MouseEvent<HTMLButtonElement>, disabled: boolean) => {
    if (disabled) return;
    e.currentTarget.style.background = '#00bcd4';
    e.currentTarget.style.color = '#000';
    e.currentTarget.style.boxShadow = '0 0 12px rgba(0,188,212,0.6)';
  };

  const leaveStyle = (e: React.MouseEvent<HTMLButtonElement>, disabled: boolean) => {
    if (disabled) return;
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.color = '#fff';
    e.currentTarget.style.boxShadow = 'none';
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
          {accessExpired ? 'Access Expired' : 'Generate Your Access Key'}
        </h2>
        
        <p style={{ 
          color: '#d4eaff', 
          marginBottom: '20px', 
          fontSize: '14px' 
        }}>
          {accessExpired 
            ? 'Your 24-hour access period has ended.'
            : 'Click below to generate your 24-hour access key.'}
        </p>

        {!accessExpired && !localStorage.getItem('accessTime') && (
          <>
            <button
              onClick={handleGenerateKey}
              style={buttonStyle(false)}
              onMouseEnter={(e) => hoverStyle(e, false)}
              onMouseLeave={(e) => leaveStyle(e, false)}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Access Key'}
            </button>
            
            <p style={{ 
              color: '#ffcb6b',
              fontSize: '13px',
              marginTop: '10px',
              display: loading ? 'block' : 'none',
              animation: 'flicker 1.5s infinite alternate'
            }}>
              Generating your access key...
            </p>
          </>
        )}

        {(accessExpired || localStorage.getItem('accessTime')) && (
          <button
            onClick={handleGenerateKey}
            style={buttonStyle(false)}
            onMouseEnter={(e) => hoverStyle(e, false)}
            onMouseLeave={(e) => leaveStyle(e, false)}
            disabled={loading}
          >
            {accessExpired ? 'Generate New Key' : 'Access Website'}
          </button>
        )}

        {cooldownMessage && (
          <p style={{ 
            color: accessExpired ? '#ff6b6b' : '#ffcb6b',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            {cooldownMessage}
          </p>
        )}

        <button
          onClick={handleTutorialVideo}
          style={buttonStyle(false)}
          onMouseEnter={(e) => hoverStyle(e, false)}
          onMouseLeave={(e) => leaveStyle(e, false)}
        >
          TUTORIAL VIDEO [EASY METHOD]
        </button>

        <p style={{ 
          color: '#d4eaff', 
          fontSize: '14px', 
          marginTop: '20px' 
        }}>
          <strong>Watch TUTORIAL Video FIRST</strong> to avoid any issues.
        </p>
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
