import React, { useEffect, useState } from 'react';

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const preloader = document.getElementById('intro-preloader');
    const mainContent = document.getElementById('main-site-content');

    if (!preloader) return;

    // 1. Kick off the sliding halves animation shortly after mount
    const timer1 = setTimeout(() => {
      preloader.classList.add('animated');
    }, 100);

    // 2. Trigger the "beam/glow" effect exactly when they snap shut (1.4s duration)
    const timer2 = setTimeout(() => {
      preloader.classList.add('beaming');
    }, 1400);

    // 3. Fade out the entire preloader overlay and display the final website
    const timer3 = setTimeout(() => {
      preloader.classList.add('fade-out');
      if (mainContent) {
        mainContent.classList.add('visible');
      }
    }, 2300);
    
    // 4. Remove from DOM after fade out completes
    const timer4 = setTimeout(() => {
      setIsVisible(false);
    }, 3100); // 2300 + 800ms fade transition

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="intro-preloader">
      <div className="stripe-bg"></div>
      
      <div className="logo-wrapper">
        <svg viewBox="0 0 600 500" className="m-logo">
          <defs>
            <mask id="slat-mask">
              <rect width="100%" height="100%" fill="white" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="black" strokeWidth="8" />
              <line x1="0" y1="160" x2="600" y2="160" stroke="black" strokeWidth="8" />
              <line x1="0" y1="240" x2="600" y2="240" stroke="black" strokeWidth="8" />
              <line x1="0" y1="320" x2="600" y2="320" stroke="black" strokeWidth="8" />
              <line x1="0" y1="400" x2="600" y2="400" stroke="black" strokeWidth="8" />
            </mask>
          </defs>

          <g mask="url(#slat-mask)" fill="#ECE9E4">
            <path className="m-half left-wing" d="M 80,450 L 80,50 L 190,50 L 300,320 L 300,450 L 210,450 L 190,400 L 190,200 L 140,90 L 140,450 Z" />
            <path className="m-half right-wing" d="M 520,450 L 520,50 L 410,50 L 300,320 L 300,450 L 390,450 L 410,400 L 410,200 L 460,90 L 460,450 Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};
