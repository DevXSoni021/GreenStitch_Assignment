
const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-seat-room', (seatId) => {
      socket.join(`seat-${seatId}`);
      console.log(`Client ${socket.id} joined seat room: seat-${seatId}`);
    });

    socket.on('leave-seat-room', (seatId) => {
      socket.leave(`seat-${seatId}`);
      console.log(`Client ${socket.id} left seat room: seat-${seatId}`);
    });

    socket.on('join-grid', () => {
      socket.join('grid');
      console.log(`Client ${socket.id} joined grid room`);
    });

    socket.on('leave-grid', () => {
      socket.leave('grid');
      console.log(`Client ${socket.id} left grid room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const emitSeatBooked = (io, seatId, userId) => {
  io.to(`seat-${seatId}`).emit('seat-booked', { seatId, userId });
  io.to('grid').emit('seat-booked', { seatId, userId });
};

const emitSeatReleased = (io, seatId, userId) => {
  io.to(`seat-${seatId}`).emit('seat-released', { seatId, userId });
  io.to('grid').emit('seat-released', { seatId, userId });
};

const emitGridUpdate = (io, grid) => {
  io.to('grid').emit('grid-updated', { grid });
};

module.exports = {
  setupSocketHandlers,
  emitSeatBooked,
  emitSeatReleased,
  emitGridUpdate
};

