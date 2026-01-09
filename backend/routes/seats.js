const express = require('express');
const { Booking } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { 
  createInitialGrid, 
  validateGap, 
  calculateTotalPrice,
  SEAT_STATUS,
  MAX_SEATS_PER_BOOKING 
} = require('../services/seatValidation');

const router = express.Router();

const buildGridFromBookings = async (userId) => {
  const grid = createInitialGrid();
  
  if (userId) {
    const bookings = await Booking.findAll({
      where: {
        user_id: userId,
        status: 'confirmed'
      }
    });

    bookings.forEach(booking => {
      booking.seat_ids.forEach(seatId => {
        const [row, seat] = seatId.split('-').map(Number);
        if (grid[row] && grid[row][seat]) {
          grid[row][seat].status = SEAT_STATUS.BOOKED;
        }
      });
    });
  }

  return grid;
};

router.get('/grid', optionalAuth, async (req, res) => {
  try {
    const userId = req.userId || null;
    const grid = await buildGridFromBookings(userId);
    
    res.json({
      grid,
      userId
    });
  } catch (error) {
    console.error('Get grid error:', error);
    res.status(500).json({ 
      message: 'Error fetching seat grid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/select', optionalAuth, async (req, res) => {
  try {
    const { rowIndex, seatIndex, currentSelection } = req.body;

    if (typeof rowIndex !== 'number' || typeof seatIndex !== 'number') {
      return res.status(400).json({ 
        message: 'Invalid rowIndex or seatIndex' 
      });
    }

    if (rowIndex < 0 || rowIndex > 7 || seatIndex < 0 || seatIndex > 9) {
      return res.status(400).json({ 
        message: 'Invalid seat coordinates' 
      });
    }

    const userId = req.userId || null;
    const grid = await buildGridFromBookings(userId);

    if (currentSelection && Array.isArray(currentSelection)) {
      currentSelection.forEach(seatId => {
        const [r, s] = seatId.split('-').map(Number);
        if (grid[r] && grid[r][s] && grid[r][s].status === SEAT_STATUS.AVAILABLE) {
          grid[r][s].status = SEAT_STATUS.SELECTED;
        }
      });
    }

    const seat = grid[rowIndex][seatIndex];
    const currentStatus = seat.status;

    if (currentStatus === SEAT_STATUS.BOOKED) {
      return res.status(400).json({ 
        message: 'Cannot select booked seats' 
      });
    }

    const isSelecting = currentStatus === SEAT_STATUS.AVAILABLE;
    const currentSelectedCount = currentSelection ? currentSelection.length : 0;

    if (isSelecting && currentSelectedCount >= MAX_SEATS_PER_BOOKING) {
      return res.status(400).json({ 
        message: `Maximum ${MAX_SEATS_PER_BOOKING} seats can be selected at once` 
      });
    }

    if (isSelecting) {
      const isValid = validateGap(grid, rowIndex, seatIndex, currentStatus);
      if (!isValid) {
        return res.status(400).json({ 
          message: 'Cannot select this seat. It would create an isolated available seat.' 
        });
      }
    }

    res.json({
      valid: true,
      message: 'Seat selection is valid'
    });
  } catch (error) {
    console.error('Select seat error:', error);
    res.status(500).json({ 
      message: 'Error validating seat selection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/book', authenticate, async (req, res) => {
  try {
    const { seatIds } = req.body;

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ 
        message: 'seatIds must be a non-empty array' 
      });
    }

    if (seatIds.length > MAX_SEATS_PER_BOOKING) {
      return res.status(400).json({ 
        message: `Cannot book more than ${MAX_SEATS_PER_BOOKING} seats` 
      });
    }

    const grid = await buildGridFromBookings(req.userId);
    
    for (const seatId of seatIds) {
      const [row, seat] = seatId.split('-').map(Number);
      if (!grid[row] || !grid[row][seat]) {
        return res.status(400).json({ 
          message: `Invalid seat ID: ${seatId}` 
        });
      }
      if (grid[row][seat].status === SEAT_STATUS.BOOKED) {
        return res.status(400).json({ 
          message: `Seat ${seatId} is already booked` 
        });
      }
    }

    const totalPrice = calculateTotalPrice(grid, seatIds);

    const booking = await Booking.create({
      user_id: req.userId,
      seat_ids: seatIds,
      total_price: totalPrice,
      status: 'confirmed',
      booking_date: new Date()
    });

    const io = req.app.get('io');
    if (io) {
      seatIds.forEach(seatId => {
        io.emit('seat-booked', { seatId, userId: req.userId });
      });
    }

    res.status(201).json({
      message: `Successfully booked ${seatIds.length} seat(s)`,
      booking: {
        id: booking.id,
        seatIds: booking.seat_ids,
        totalPrice: booking.total_price,
        bookingDate: booking.booking_date
      }
    });
  } catch (error) {
    console.error('Book seats error:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/clear', optionalAuth, (req, res) => {
  res.json({ 
    message: 'Selection cleared' 
  });
});

router.post('/reset', authenticate, async (req, res) => {
  try {
    const deletedCount = await Booking.destroy({
      where: {
        user_id: req.userId,
        status: 'confirmed'
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('seats-reset', { userId: req.userId });
    }

    res.json({
      message: `Reset ${deletedCount} booking(s)`,
      deletedCount
    });
  } catch (error) {
    console.error('Reset seats error:', error);
    res.status(500).json({ 
      message: 'Error resetting bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

