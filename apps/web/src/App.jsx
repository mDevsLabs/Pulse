import React, { useState, useRef } from 'react';
import { ExternalLink, RotateCw, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import './App.css';

const EMBED_URL = "https://mai-officiel.vercel.app";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = EMBED_URL;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
      }
    }
  };

  return (
    <div className="app-container">
      {!isFullscreen && (
        <header className="header">
          <div className="brand-section">
            <div className="brand-logo-wrapper">
              <img src="/logo.png" alt="mAI Pulse Logo" className="brand-logo" />
            </div>
            <span className="brand-title">mAI Pulse</span>
            <span className="brand-badge">
              <span className="status-dot"></span>
              En ligne
            </span>
          </div>

          <div className="controls-section">
            <button 
              className="action-btn" 
              onClick={handleRefresh} 
              title="Rafraîchir"
            >
              <RotateCw size={16} className={isLoading ? "spin-icon" : ""} />
              <span>Rafraîchir</span>
            </button>

            <button 
              className="action-btn" 
              onClick={toggleFullscreen} 
              title="Plein écran"
            >
              <Maximize2 size={16} />
              <span>Plein écran</span>
            </button>

            <a 
              href={EMBED_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-btn primary"
              title="Ouvrir le site officiel"
            >
              <ExternalLink size={16} />
              <span>Site Officiel</span>
            </a>
          </div>
        </header>
      )}

      <main className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">Chargement de mAI Pulse...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={EMBED_URL}
          className="mai-iframe"
          title="mAI Pulse Interface"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
          onLoad={() => setIsLoading(false)}
        />
      </main>
    </div>
  );
}
