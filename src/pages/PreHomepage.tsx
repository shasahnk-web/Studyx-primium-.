import { useEffect, useState } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const PreHomepage = () => {
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const serverLink = 'https://reel2earn.com/xlPui0Mc';
  const tutorialLink = 'https://t.me/studyx_1';

  useEffect(() => {
    // Load particles.js script
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

    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Check if user has joined Telegram
    const joined = localStorage.getItem("joinedTelegram");
    if (!joined) {
      setShowTelegramPopup(true);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (fontLink.parentNode) {
        fontLink.parentNode.removeChild(fontLink);
      }
    };
  }, []);

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

  const closePopup = () => {
    setShowTelegramPopup(false);
  };

  const joinChannel = () => {
    localStorage.setItem("joinedTelegram", "true");
    window.open(tutorialLink, "_blank");
    setShowTelegramPopup(false);
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

      {showTelegramPopup && (
        <div className="telegram-popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="close-btn" onClick={closePopup}>×</span>
            </div>
            <h2>🚨 Notice 🚨</h2>
            <p><u>Read Carefully</u></p>
            <p>Join the channel below to never miss any update. 🚨</p>
            <a href={tutorialLink} className="join-btn" onClick={joinChannel}>Join Channel</a>
          </div>
        </div>
      )}

      <div 
        className="container"
        style={{
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '15px',
          padding: '30px',
          width: '400px',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(0,174,255,0.3)',
          border: '1px solid rgba(0,174,255,0.2)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <h2 
          style={{ 
            color: '#a3f7ff', 
            textShadow: '0 0 10px rgba(0,234,255,0.5)',
            fontSize: '24px'
          }}
        >
          Generate Your Access Key
        </h2>
        
        <p style={{ color: '#d4eaff', fontSize: '14px', marginBottom: '20px' }}>
          Click the button below to generate your key.<br /><br />
          Validity: 24 hours ⏰
        </p>
        
        <button
          className="button"
          onClick={() => redirectToUrl(serverLink)}
        >
          Website Server - 1
        </button>
        
        <button
          className="button"
          onClick={() => redirectToUrl(serverLink)}
        >
          Website Server - 2
        </button>
        
        <button
          className="button"
          onClick={() => redirectToUrl(serverLink)}
        >
          Website Server - 3
        </button>
        
        <button
          className="button"
          onClick={handleTutorialVideo}
        >
          TUTORIAL VIDEO [EASY METHOD]
        </button>
        
        <p style={{ color: '#d4eaff', fontSize: '14px', marginBottom: '20px' }}>
          Please do <strong>Watch TUTORIAL Video FIRST</strong>, so that you not face any Problem.
        </p>
        
        <p 
          className="loading"
          id="loadingMessage"
        >
          Generating URL, please wait...
        </p>
      </div>

      <style jsx>{`
        .button {
          display: inline-block;
          width: 100%;
          padding: 12px;
          font-size: 15px;
          color: #ffffff;
          border: 1px solid #00bcd4;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          margin: 8px 0;
          font-weight: 600;
          transition: 0.3s;
          text-transform: uppercase;
        }
        
        .button:hover {
          background: #00bcd4;
          color: #000;
          box-shadow: 0 0 12px rgba(0, 188, 212, 0.6);
        }
        
        .loading {
          font-size: 13px;
          color: #ffcb6b;
          margin-top: 10px;
          display: none;
          animation: flicker 1.5s infinite alternate;
        }
        
        @keyframes flicker {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        
        .telegram-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(10, 10, 10, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: shake 1s ease-in-out infinite alternate;
        }
        
        .popup-content {
          background-color: #111827;
          color: #f9f9f9;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 0 30px rgba(0, 153, 255, 0.7);
          animation: glow 2s infinite ease-in-out;
          position: relative;
        }
        
        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .close-btn {
          font-size: 28px;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
        }
        
        .join-btn {
          background-color: #0088cc;
          color: white;
          padding: 12px 22px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          display: inline-block;
          transition: background 0.3s ease;
        }
        
        .join-btn:hover {
          background-color: #0077b6;
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 15px #00bfff; }
          100% { box-shadow: 0 0 30px #00bfff; }
        }
        
        @keyframes shake {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default PreHomepage;
