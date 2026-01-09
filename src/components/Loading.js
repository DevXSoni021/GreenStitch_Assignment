import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Preparing your seats...', submessage = 'Securing your spot in the forest of sound', progress = null, showCancel = false, onCancel }) => {
  const progressPercentage = progress !== null ? Math.min(100, Math.max(0, progress)) : null;

  return (
    <div className="loading-screen-container">
      <div className="loading-background">
        <div className="loading-bg-image"></div>
        <div className="loading-bg-gradient"></div>
        <div className="loading-spotlight"></div>
      </div>

      <div className="loading-content">
        <div className="loading-visualization">
          <div className="orbital-ring orbital-ring-1"></div>
          <div className="orbital-ring orbital-ring-2"></div>
          
          <div className="central-sphere">
            <div className="sphere-inner-glow"></div>
            <span className="material-symbols-outlined sphere-icon">event_seat</span>
          </div>

          <div className="orbiting-pod pod-1">
            <div className="pod-circle"></div>
          </div>
          <div className="orbiting-pod pod-2">
            <div className="pod-circle pod-primary"></div>
          </div>
          <div className="orbiting-pod pod-3">
            <div className="pod-circle pod-small"></div>
          </div>

          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>

        <div className="loading-status">
          <div className="status-text">
            <h2 className="status-title">{message}</h2>
            <p className="status-subtitle">{submessage}</p>
          </div>

          {progressPercentage !== null && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-labels">
                <span className="progress-label">Processing</span>
                <span className="progress-percentage">{progressPercentage}%</span>
              </div>
            </div>
          )}

          {showCancel && (
            <button 
              className="loading-cancel-btn"
              onClick={onCancel}
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      <div className="loading-footer">
        <div className="footer-info">
          <span className="material-symbols-outlined">lock</span>
          <span>Encrypted Connection</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;

