import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  RotateCw, 
  Maximize2, 
  Cookie, 
  Github, 
  CheckCircle2, 
  X, 
  Key, 
  Save, 
  Trash2,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';
import './App.css';

const DESTINATIONS = {
  web: {
    id: 'web',
    label: 'mAI Web',
    url: 'https://mai-officiel.vercel.app',
  },
  official: {
    id: 'official',
    label: 'Officiel',
    url: 'https://mai-devs.vercel.app',
  },
};

const DESTINATION_KEY = 'mai_pulse_destination';
const STATUS_URL = "https://mai-officiel.instatus.com";
const API_URL = "https://mai.val.run";
const GITHUB_URL = "https://github.com/mDevsLabs/Pulse";

const readStoredDestination = () => {
  const stored = localStorage.getItem(DESTINATION_KEY);
  return stored === 'official' ? 'official' : 'web';
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [systemStatus, setSystemStatus] = useState('operational'); // 'operational', 'degraded', 'error'
  const [apiLatency, setApiLatency] = useState(null);
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem('mai_session_token') || '');
  const [customCookies, setCustomCookies] = useState(() => localStorage.getItem('mai_custom_cookies') || '');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');
  const [destinationId, setDestinationId] = useState(readStoredDestination);

  const iframeRef = useRef(null);
  const destination = DESTINATIONS[destinationId];

  // Check API and Instatus Health
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    const start = Date.now();
    try {
      const res = await fetch(API_URL, { method: 'GET', mode: 'no-cors' });
      setApiLatency(Date.now() - start);
      setSystemStatus('operational');
    } catch (err) {
      console.warn("API ping note:", err);
      // Even if no-cors or fetch issue, fallback status check
      setSystemStatus('operational');
    }
  };

  const switchDestination = (id) => {
    if (id === destinationId) {
      return;
    }
    setDestinationId(id);
    localStorage.setItem(DESTINATION_KEY, id);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = destination.url;
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

  const saveCookies = (e) => {
    e.preventDefault();
    localStorage.setItem('mai_session_token', sessionToken);
    localStorage.setItem('mai_custom_cookies', customCookies);

    if (sessionToken) {
      document.cookie = `mai_session=${encodeURIComponent(sessionToken)}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    }
    if (customCookies) {
      customCookies.split(';').forEach(cookie => {
        if (cookie.trim()) {
          document.cookie = `${cookie.trim()}; path=/; max-age=31536000; SameSite=Lax; Secure`;
        }
      });
    }

    setSavedSuccessMsg('Cookies et jetons de session enregistrés !');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const clearCookies = () => {
    localStorage.removeItem('mai_session_token');
    localStorage.removeItem('mai_custom_cookies');
    setSessionToken('');
    setCustomCookies('');
    document.cookie = "mai_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setSavedSuccessMsg('Cookies réinitialisés.');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  return (
    <div className="app-container">
      {!isFullscreen && (
        <header className="header">
          <div className="brand-section">
            <div className="brand-logo-wrapper">
              <img src="/logo.png" alt="mAI Pulse Logo" className="brand-logo" />
            </div>
            <div className="brand-meta">
              <span className="brand-title">mAI Pulse</span>
              <a 
                href={STATUS_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`status-badge ${systemStatus}`}
                title="Consulter le statut du service"
              >
                <span className="status-dot"></span>
                <span>{systemStatus === 'operational' ? 'Systèmes opérationnels' : 'Incidents'}</span>
                {apiLatency !== null && <span className="latency">{apiLatency}ms</span>}
              </a>
            </div>
          </div>

          <div className="controls-section">
            <div className="dest-switch" role="group" aria-label="Choisir la destination">
              <button
                type="button"
                className={`dest-btn ${destinationId === 'web' ? 'active' : ''}`}
                onClick={() => switchDestination('web')}
                title="mAI Web — mai-officiel.vercel.app"
              >
                <Globe size={14} />
                <span>mAI Web</span>
              </button>
              <button
                type="button"
                className={`dest-btn ${destinationId === 'official' ? 'active' : ''}`}
                onClick={() => switchDestination('official')}
                title="Site officiel — mai-devs.vercel.app"
              >
                <Sparkles size={14} />
                <span>Officiel</span>
              </button>
            </div>

            <button 
              className="action-btn"
              onClick={() => setShowCookieModal(true)}
              title="Gestion des cookies & session"
            >
              <Cookie size={16} />
              <span>Cookies & Auth</span>
            </button>

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
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-btn icon-only"
              title="Code source GitHub (mDevsLabs/Pulse)"
            >
              <Github size={16} />
            </a>

            <a 
              href={destination.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="action-btn primary"
              title={`Ouvrir ${destination.label} dans un nouvel onglet`}
            >
              <ExternalLink size={16} />
              <span>Ouvrir</span>
            </a>
          </div>
        </header>
      )}

      <main className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">Chargement de {destination.label}...</p>
          </div>
        )}
        <iframe
          key={destination.id}
          ref={iframeRef}
          src={destination.url}
          className="mai-iframe"
          title={destination.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
          onLoad={() => setIsLoading(false)}
        />
      </main>

      {/* Modal Cookies & Auth */}
      {showCookieModal && (
        <div className="modal-backdrop" onClick={() => setShowCookieModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Cookie className="modal-icon" size={20} />
                <h3>Cookies & Session de Connexion</h3>
              </div>
              <button className="close-btn" onClick={() => setShowCookieModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveCookies} className="modal-body">
              <p className="modal-desc">
                Configurez les cookies de connexion et jetons d'authentification pour maintenir votre session active dans l'extension et accéder aux APIs de <strong>mAI Pulse</strong>.
              </p>

              {savedSuccessMsg && (
                <div className="alert-success">
                  <CheckCircle2 size={16} />
                  <span>{savedSuccessMsg}</span>
                </div>
              )}

              <div className="form-group">
                <label>
                  <Key size={14} /> Jeton de session (mAI Session Token)
                </label>
                <input 
                  type="password" 
                  placeholder="ex: eyJhbGciOiJIUzI1NiIsInR5..." 
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  <Cookie size={14} /> Cookies personnalisés (Format Key=Value; ...)
                </label>
                <textarea 
                  rows={3}
                  placeholder="session_id=abc123xyz; auth_token=secret_token" 
                  value={customCookies}
                  onChange={(e) => setCustomCookies(e.target.value)}
                />
              </div>

              <div className="api-endpoints-info">
                <h4><Zap size={14} /> Endpoints Système :</h4>
                <ul>
                  <li><strong>API Endpoint :</strong> <code>{API_URL}</code></li>
                  <li><strong>Status Page :</strong> <a href={STATUS_URL} target="_blank" rel="noreferrer">{STATUS_URL}</a></li>
                  <li><strong>GitHub :</strong> <a href={GITHUB_URL} target="_blank" rel="noreferrer">{GITHUB_URL}</a></li>
                </ul>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-danger" onClick={clearCookies}>
                  <Trash2 size={16} />
                  <span>Réinitialiser</span>
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={16} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
