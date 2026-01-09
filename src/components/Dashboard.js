import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bookingService from '../services/bookingService';
import { toast } from 'sonner';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    totalSeats: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      setBookings(response.bookings || []);
      
      const totalBookings = response.bookings.length;
      const totalSpent = response.bookings.reduce((sum, booking) => 
        sum + parseFloat(booking.total_price || 0), 0
      );
      const totalSeats = response.bookings.reduce((sum, booking) => 
        sum + (booking.seat_ids?.length || 0), 0
      );
      
      setStats({ totalBookings, totalSpent, totalSeats });
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Load bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSeatIds = (seatIds) => {
    return seatIds.map(id => {
      const [row, seat] = id.split('-').map(Number);
      const rowLabel = String.fromCharCode(65 + row);
      return `${rowLabel}${seat + 1}`;
    }).join(', ');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>GreenStitch Seat Booking</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
        <div className="header-actions">
          <Link to="/bookings" className="btn-primary">
            Book Seats
          </Link>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-value">{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Seats Booked</h3>
          <p className="stat-value">{stats.totalSeats}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-value">₹{stats.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <div className="bookings-section">
        <h2>Booking History</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings yet. Start booking seats!</p>
            <Link to="/bookings" className="btn-primary">
              Book Your First Seat
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>Booking #{booking.id.slice(0, 8)}</h3>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p><strong>Seats:</strong> {formatSeatIds(booking.seat_ids)}</p>
                  <p><strong>Total Price:</strong> ₹{parseFloat(booking.total_price).toFixed(2)}</p>
                  <p><strong>Booking Date:</strong> {formatDate(booking.booking_date)}</p>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                        try {
                          await bookingService.cancelBooking(booking.id);
                          toast.success('Booking cancelled');
                          loadBookings();
                        } catch (error) {
                          toast.error('Failed to cancel booking');
                        }
                      }
                    }}
                    className="btn-cancel"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

