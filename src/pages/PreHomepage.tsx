
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const PreHomepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load particles.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      // Initialize particles after script loads
      if (window.particlesJS) {
        window.particlesJS("particles-js", {
          particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: "#00bcd4" },
            shape: { type: "circle" },
            opacity: { value: 0.5, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 2.5, random: true },
            line_linked: { enable: true, distance: 140, color: "#00bcd4", opacity: 0.3, width: 1 },
            move: { enable: true, speed: 1.5, out_mode: "out" }
          },
          interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
            modes: { grab: { distance: 120, line_linked: { opacity: 1 } } }
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

  const urls = {
    server02: 'https://shortner.in/yMrUgz',
    server03: 'https://shortner.in/yMrUgz',
    recommendServer: 'https://shortner.in/yMrUgz',
    tutorialVideo: 'https://t.me/studyx_1'
  };

  const redirectToUrl = (url: string) => {
    if (!url) {
      alert('Invalid URL!');
      return;
    }
    
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) {
      loadingMessage.style.display = "block";
    }
    
    setTimeout(() => {
      // Mark as completed and redirect to homepage
      localStorage.setItem('preHomepageCompleted', 'true');
      window.location.href = url;
    }, 2000);
  };

  const handleTutorialVideo = () => {
    window.open(urls.tutorialVideo, '_blank');
    // After tutorial, redirect to homepage
    setTimeout(() => {
      localStorage.setItem('preHomepageCompleted', 'true');
      navigate('/homepage');
    }, 1000);
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
          className="text-2xl mb-4"
          style={{ 
            color: '#a3f7ff', 
            textShadow: '0 0 10px rgba(0,234,255,0.5)' 
          }}
        >
          Generate Your Access Key
        </h2>
        
        <p className="mb-5" style={{ color: '#d4eaff' }}>
          Click below to generate your key.<br /><br />
          Validity: 30 hours ⏰
        </p>
        
        <button
          id="server02"
          onClick={() => redirectToUrl(urls.server02)}
          className="w-full p-3 text-white border border-[#00bcd4] bg-transparent rounded-lg cursor-pointer font-semibold my-2 transition-all duration-300 hover:bg-[#00bcd4] hover:text-black hover:shadow-[0_0_12px_rgba(0,188,212,0.6)]"
        >
          Website Server - 1
        </button>
        
        <button
          id="server03Url"
          onClick={() => redirectToUrl(urls.server03)}
          className="w-full p-3 text-white border border-[#00bcd4] bg-transparent rounded-lg cursor-pointer font-semibold my-2 transition-all duration-300 hover:bg-[#00bcd4] hover:text-black hover:shadow-[0_0_12px_rgba(0,188,212,0.6)]"
        >
          Website Server - 2
        </button>
        
        <button
          id="recommendServer"
          onClick={() => redirectToUrl(urls.recommendServer)}
          className="w-full p-3 text-white border border-[#00bcd4] bg-transparent rounded-lg cursor-pointer font-semibold my-2 transition-all duration-300 hover:bg-[#00bcd4] hover:text-black hover:shadow-[0_0_12px_rgba(0,188,212,0.6)]"
        >
          Website Server - 3
        </button>
        
        <button
          id="watchVideo"
          onClick={handleTutorialVideo}
          className="w-full p-3 text-white border border-[#00bcd4] bg-transparent rounded-lg cursor-pointer font-semibold my-2 transition-all duration-300 hover:bg-[#00bcd4] hover:text-black hover:shadow-[0_0_12px_rgba(0,188,212,0.6)]"
        >
          TUTORIAL VIDEO
        </button>
        
        <p className="text-sm" style={{ color: '#d4eaff' }}>
          <strong>Watch tutorial first</strong> to avoid problems.
        </p>
        
        <p 
          className="text-xs mt-2 hidden animate-pulse" 
          id="loadingMessage"
          style={{ 
            color: '#ffcb6b',
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
