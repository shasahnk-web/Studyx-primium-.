
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    particlesJS: any;
  }
}

const GatePage = () => {
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

  const handleWatchVideo = () => {
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) {
      loadingMessage.style.display = "block";
    }
    
    setTimeout(() => {
      window.open('https://t.me/studyx_1', '_blank');
      if (loadingMessage) {
        loadingMessage.style.display = "none";
      }
      
      // Mark as completed and navigate to homepage
      localStorage.setItem('gateCompleted', 'true');
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0f1d] text-white overflow-hidden flex justify-center items-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div id="particles-js" className="absolute w-full h-full -z-10"></div>
      
      <div className="bg-white/[0.07] rounded-[15px] p-[30px] w-[400px] text-center shadow-[0_0_15px_rgba(0,174,255,0.3)] border border-[rgba(0,174,255,0.2)] backdrop-blur-[8px]">
        <h2 className="text-2xl text-[#a3f7ff] mb-2" style={{ textShadow: '0 0 10px rgba(0,234,255,0.5)' }}>
          Generate Your Access Key
        </h2>
        
        <p className="text-sm mb-5 text-[#d4eaff]">
          Click the button below to watch the tutorial video
        </p>
        
        <button
          id="watchVideo"
          onClick={handleWatchVideo}
          className="inline-block w-full p-3 text-[15px] text-white border border-[#00bcd4] bg-transparent rounded-[8px] cursor-pointer my-2 font-semibold transition-all duration-300 uppercase relative overflow-hidden hover:bg-[#00bcd4] hover:text-black hover:shadow-[0_0_12px_rgba(0,188,212,0.6)]"
        >
          TUTORIAL VIDEO [EASY METHOD]
        </button>
        
        <p className="text-sm text-[#d4eaff] mb-2">
          Please <strong>Watch TUTORIAL Video FIRST</strong>, so that you don't face any problems.
        </p>
        
        <p 
          className="text-[13px] text-[#ffcb6b] mt-2 hidden animate-pulse" 
          id="loadingMessage"
        >
          Loading video, please wait...
        </p>
      </div>
    </div>
  );
};

export default GatePage;
