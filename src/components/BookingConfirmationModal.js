import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './BookingConfirmationModal.css';

const BookingConfirmationModal = ({ isOpen, onClose, onConfirm, selectedSeats, totalPrice }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  const formatSeatIds = (seatIds) => {
    return seatIds.map(id => {
      const [row, seat] = id.split('-').map(Number);
      const rowLabel = String.fromCharCode(65 + row);
      return `${rowLabel}${seat + 1}`;
    }).join(', ');
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Confirm Booking</h2>
              <button className="close-button" onClick={onClose} aria-label="Close">
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="booking-summary">
                <div className="summary-item">
                  <span className="summary-label">Number of Seats:</span>
                  <span className="summary-value">{selectedSeats.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Selected Seats:</span>
                  <span className="summary-value seats-list">{formatSeatIds(selectedSeats)}</span>
                </div>
                <div className="summary-item total">
                  <span className="summary-label">Total Price:</span>
                  <span className="summary-value price">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="modal-message">
                <p>Please review your selection before confirming.</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={onConfirm}>
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BookingConfirmationModal;

