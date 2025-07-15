import { useEffect } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const PreHomepage = () => {
  useEffect(() => {
    // Load particles.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      // Initialize particles after script loads
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

    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (fontLink.parentNode) {
        fontLink.parentNode.removeChild(fontLink);
      }
    };
  }, []);

  const serverLink = 'https://reel2earn.com/xlPui0Mc';
  const tutorialLink = 'https://t.me/studyx_1';

  const redirectToUrl = (url: string) => {
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) {
      loadingMessage.style.display = "block";
    }
    setTimeout(() => { 
      localStorage.setItem('preHomepageCompleted', 'true');
      window.location.href = url; 
    }, 1500);
  };

  const handleTutorialVideo = () => {
    window.open(tutorialLink, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 text-white overflow-hidden flex justify-center items-center relative"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        background: '#0a0f1d'
      }}
    >
      <div id="particles-js" className="absolute w-full h-full -z-10"></div>
      
      <div 
        className="text-center"
        style={{
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '15px',
          padding: '30px',
          width: '400px',
          boxShadow: '0 0 15px rgba(0,174,255,0.3)',
          border: '1px solid rgba(0,174,255,0.2)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <h2 
          style={{ 
            color: '#a3f7ff', 
            textShadow: '0 0 10px rgba(0,234,255,0.5)',
            marginBottom: '20px'
          }}
        >
          Generate Your Access Key
        </h2>
        
        <p style={{ color: '#d4eaff', marginBottom: '20px', fontSize: '14px' }}>
          Click the button below to generate your key.<br /><br />
          Validity: 30 hours ⏰
        </p>
        
        <button
          id="server01"
          onClick={() => redirectToUrl(serverLink)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '15px',
            color: '#fff',
            border: '1px solid #00bcd4',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '8px 0',
            fontWeight: '600',
            transition: '0.3s',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00bcd4';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,188,212,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Website Server - 1
        </button>
        
        <button
          id="server02"
          onClick={() => redirectToUrl(serverLink)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '15px',
            color: '#fff',
            border: '1px solid #00bcd4',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '8px 0',
            fontWeight: '600',
            transition: '0.3s',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00bcd4';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,188,212,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Website Server - 2
        </button>
        
        <button
          id="server03"
          onClick={() => redirectToUrl(serverLink)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '15px',
            color: '#fff',
            border: '1px solid #00bcd4',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '8px 0',
            fontWeight: '600',
            transition: '0.3s',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00bcd4';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,188,212,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Website Server - 3
        </button>
        
        <button
          id="watchVideo"
          onClick={handleTutorialVideo}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '15px',
            color: '#fff',
            border: '1px solid #00bcd4',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '8px 0',
            fontWeight: '600',
            transition: '0.3s',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00bcd4';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(0,188,212,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          TUTORIAL VIDEO [EASY METHOD]
        </button>
        
        <p style={{ color: '#d4eaff', fontSize: '14px', marginBottom: '20px' }}>
          <strong>Watch TUTORIAL Video FIRST</strong> so you don't face any problems.
        </p>
        
        <p 
          id="loadingMessage"
          style={{ 
            fontSize: '13px',
            color: '#ffcb6b',
            marginTop: '10px',
            display: 'none',
            animation: 'flicker 1.5s infinite alternate'
          }}
        >
          Generating URL, please wait...
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
