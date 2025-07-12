
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TaskVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize particles.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
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

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const urls = {
    server02: 'https://shortner.in/0b3Q',
    server03: 'https://shortner.in/0b3Q',
    recommendServer: 'https://shortner.in/0b3Q',
    tutorialVideo: 'https://t.me/studyx_1'
  };

  const setTemporaryCookieAndRedirect = (cookieName: string, url: string) => {
    if (!url) {
      alert('Invalid URL!');
      return;
    }
    
    const loadingElement = document.getElementById("loadingMessage");
    if (loadingElement) {
      loadingElement.style.display = "block";
    }
    
    setTimeout(() => {
      document.cookie = `${cookieName}=true; path=/; max-age=${24 * 61 * 60}`;
      // Instead of redirecting to external URL, redirect to PW Courses access page
      navigate('/courses/pw-courses/access');
    }, 2000);
  };

  const handleServerClick = (server: string, url: string) => {
    setTemporaryCookieAndRedirect(`${server}KeyGenerated`, url);
  };

  const handleTutorialClick = () => {
    window.open(urls.tutorialVideo, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white overflow-hidden relative flex justify-center items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }
        
        .cyberpunk-button {
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
          position: relative;
          overflow: hidden;
        }
        
        .cyberpunk-button:hover {
          background: #00bcd4;
          color: #000;
          box-shadow: 0 0 12px rgba(0, 188, 212, 0.6);
        }
        
        .loading-animation {
          font-size: 13px;
          color: #ffcb6b;
          margin-top: 10px;
          display: none;
          animation: flicker 1.5s infinite alternate;
        }
        
        @keyframes flicker {
          from {
            opacity: 0.6;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Particles Background */}
      <div id="particles-js" className="absolute w-full h-full -z-10"></div>
      
      {/* Header with Back Button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Home
        </Button>
      </div>
      
      {/* Main Container */}
      <Card className="bg-white/[0.07] border-[#00aeffe6]/20 backdrop-blur-sm shadow-[0_0_15px_rgba(0,174,255,0.3)] w-[400px] max-w-[90vw]">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#a3f7ff] mb-4" style={{ textShadow: '0 0 10px rgba(0, 234, 255, 0.5)' }}>
            Generate Your Access Key
          </h2>
          <p className="text-sm mb-5 text-[#d4eaff]">
            Click the button below to generate your key for PW Courses access.<br /><br />
            Validity: 30 hours ⏰
          </p>
          
          <div className="space-y-2">
            <button 
              className="cyberpunk-button"
              onClick={() => handleServerClick('server02', urls.server02)}
            >
              Website Server - 1
            </button>
            
            <button 
              className="cyberpunk-button"
              onClick={() => handleServerClick('server03', urls.server03)}
            >
              Website Server - 2
            </button>
            
            <button 
              className="cyberpunk-button"
              onClick={() => handleServerClick('recommendServer', urls.recommendServer)}
            >
              Website Server - 3
            </button>
            
            <button 
              className="cyberpunk-button"
              onClick={handleTutorialClick}
            >
              TUTORIAL VIDEO [EASY METHOD]
            </button>
          </div>
          
          <p className="text-sm mt-4 text-[#d4eaff]">
            Please do <strong>Watch TUTORIAL Video FIRST</strong>, so that you not face any Problem.
          </p>
          
          <p id="loadingMessage" className="loading-animation">
            Generating access key, please wait...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskVerification;
