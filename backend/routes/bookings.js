const express = require('express');
const { Booking } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const whereClause = {
      user_id: req.userId
    };

    if (status) {
      whereClause.status = status;
    }

    const bookings = await Booking.findAndCountAll({
      where: whereClause,
      order: [['booking_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'seat_ids', 'total_price', 'status', 'booking_date', 'createdAt', 'updatedAt']
    });

    res.json({
      bookings: bookings.rows,
      total: bookings.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      where: {
        id,
        user_id: req.userId
      },
      attributes: ['id', 'seat_ids', 'total_price', 'status', 'booking_date', 'createdAt', 'updatedAt']
    });

    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found' 
      });
    }

    res.json({
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      message: 'Error fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      where: {
        id,
        user_id: req.userId
      }
    });

    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Booking is already cancelled' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    const io = req.app.get('io');
    if (io) {
      booking.seat_ids.forEach(seatId => {
        io.emit('seat-released', { seatId, userId: req.userId });
      });
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: {
        id: booking.id,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      message: 'Error cancelling booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

