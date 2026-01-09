
const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked'
};

const MAX_SEATS_PER_BOOKING = 8;

const validateGap = (grid, rowIndex, seatIndex, currentStatus) => {
  if (currentStatus !== SEAT_STATUS.AVAILABLE) {
    return true;
  }
  
  const clonedGrid = grid.map(row => row.map(seat => ({ ...seat })));
  
  clonedGrid[rowIndex][seatIndex].status = SEAT_STATUS.SELECTED;
  
  const isOccupied = (status) => 
    status === SEAT_STATUS.SELECTED || status === SEAT_STATUS.BOOKED;
  
  const row = clonedGrid[rowIndex];
  for (let i = 1; i < row.length - 1; i++) {
    const prevStatus = row[i - 1].status;
    const currStatus = row[i].status;
    const nextStatus = row[i + 1].status;
    
    if (currStatus === SEAT_STATUS.AVAILABLE && 
        isOccupied(prevStatus) && 
        isOccupied(nextStatus)) {
      return false;
    }
  }
  
  for (let i = 1; i < clonedGrid.length - 1; i++) {
    const prevStatus = clonedGrid[i - 1][seatIndex].status;
    const currStatus = clonedGrid[i][seatIndex].status;
    const nextStatus = clonedGrid[i + 1][seatIndex].status;
    
    if (currStatus === SEAT_STATUS.AVAILABLE && 
        isOccupied(prevStatus) && 
        isOccupied(nextStatus)) {
      return false;
    }
  }
  
  return true;
};

const getSeatPrice = (rowLabel) => {
  const PRICING_CONFIG = {
    PREMIUM: { rows: ['A', 'B', 'C'], price: 1000 },
    STANDARD: { rows: ['D', 'E', 'F'], price: 750 },
    ECONOMY: { rows: ['G', 'H'], price: 500 }
  };

  for (const [tier, config] of Object.entries(PRICING_CONFIG)) {
    if (config.rows.includes(rowLabel)) {
      return config.price;
    }
  }
  return PRICING_CONFIG.ECONOMY.price;
};

const calculateTotalPrice = (grid, selectedIds) => {
  let total = 0;
  selectedIds.forEach(id => {
    const [row, seat] = id.split('-').map(Number);
    const seatData = grid[row][seat];
    total += getSeatPrice(seatData.rowLabel);
  });
  return total;
};

const createInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 8; row++) {
    const rowSeats = [];
    const rowLabel = String.fromCharCode(65 + row);
    for (let seat = 0; seat < 10; seat++) {
      rowSeats.push({
        id: `${row}-${seat}`,
        row: row,
        rowLabel: rowLabel,
        seat: seat,
        status: SEAT_STATUS.AVAILABLE
      });
    }
    grid.push(rowSeats);
  }
  return grid;
};

module.exports = {
  validateGap,
  getSeatPrice,
  calculateTotalPrice,
  createInitialGrid,
  SEAT_STATUS,
  MAX_SEATS_PER_BOOKING
};

