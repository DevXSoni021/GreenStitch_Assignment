import React, { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import seatService from './services/seatService';
import { useAuth } from './contexts/AuthContext';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import './SeatBooking.css';

const PRICING_CONFIG = {
    PREMIUM: { rows: ['A', 'B', 'C'], price: 1000 },
    STANDARD: { rows: ['D', 'E', 'F'], price: 750 },
    ECONOMY: { rows: ['G', 'H'], price: 500 }
};

const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked'
};

const MAX_SEATS_PER_BOOKING = 8;

const initialState = {
    grid: null,
    selectedIds: new Set(),
    totalPrice: 0,
    isBooking: false,
    focusedSeatId: null
};

const ACTION_TYPES = {
    INITIALIZE: 'INITIALIZE',
    TOGGLE_SEAT: 'TOGGLE_SEAT',
    BOOK_SEATS: 'BOOK_SEATS',
    CLEAR_SELECTION: 'CLEAR_SELECTION',
    RESET: 'RESET',
    SET_FOCUSED_SEAT: 'SET_FOCUSED_SEAT',
    SET_LOADING: 'SET_LOADING'
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

const getSeatPrice = (rowLabel) => {
    for (const [tier, config] of Object.entries(PRICING_CONFIG)) {
        if (config.rows.includes(rowLabel)) {
            return config.price;
        }
    }
    return PRICING_CONFIG.ECONOMY.price;
};

const calculateTotalPriceFromSeats = (grid, selectedIds) => {
    let total = 0;
    selectedIds.forEach(id => {
        const [row, seat] = id.split('-').map(Number);
        const seatData = grid[row][seat];
        total += getSeatPrice(seatData.rowLabel);
    });
    return total;
};

const validateGapFrontend = (grid, rowIndex, seatIndex, currentStatus, selectedIds) => {
    if (currentStatus !== SEAT_STATUS.AVAILABLE) {
        return true;
    }
    
    const clonedGrid = grid.map(row => row.map(seat => ({ ...seat })));
    
    selectedIds.forEach(id => {
        const [r, s] = id.split('-').map(Number);
        if (clonedGrid[r] && clonedGrid[r][s]) {
            clonedGrid[r][s].status = SEAT_STATUS.SELECTED;
        }
    });
    
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

const seatReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.INITIALIZE:
            return {
                ...state,
                grid: action.payload.grid,
                selectedIds: action.payload.selectedIds || new Set(),
                totalPrice: action.payload.totalPrice || 0
            };
            
        case ACTION_TYPES.TOGGLE_SEAT: {
            const { rowIndex, seatIndex } = action.payload;
            const seat = state.grid[rowIndex][seatIndex];
            const seatId = seat.id;
            const currentStatus = seat.status;
            
            if (currentStatus === SEAT_STATUS.BOOKED) {
                return state;
            }
            
            const isSelecting = currentStatus === SEAT_STATUS.AVAILABLE;
            
            const newGrid = state.grid.map(row => 
                row.map(seat => {
                    if (seat.id === seatId) {
                        return {
                            ...seat,
                            status: isSelecting ? SEAT_STATUS.SELECTED : SEAT_STATUS.AVAILABLE
                        };
                    }
                    return seat;
                })
            );
            
            const newSelectedIds = new Set(state.selectedIds);
            if (isSelecting) {
                newSelectedIds.add(seatId);
            } else {
                newSelectedIds.delete(seatId);
            }
            
            const newTotalPrice = calculateTotalPriceFromSeats(newGrid, newSelectedIds);
            
            try {
                if (newSelectedIds.size > 0) {
                    localStorage.setItem('selectedSeats', JSON.stringify(Array.from(newSelectedIds)));
                } else {
                    localStorage.removeItem('selectedSeats');
                }
            } catch (e) {
                console.error('Failed to save selection to localStorage:', e);
            }
            
            return {
                ...state,
                grid: newGrid,
                selectedIds: newSelectedIds,
                totalPrice: newTotalPrice
            };
        }
        
        case ACTION_TYPES.BOOK_SEATS: {
            const newGrid = state.grid.map(row =>
                row.map(seat => {
                    if (state.selectedIds.has(seat.id)) {
                        return { ...seat, status: SEAT_STATUS.BOOKED };
                    }
                    return seat;
                })
            );
            
            try {
                localStorage.removeItem('selectedSeats');
            } catch (e) {
                console.error('Failed to clear selection from localStorage:', e);
            }
            
            return {
                ...state,
                grid: newGrid,
                selectedIds: new Set(),
                totalPrice: 0
            };
        }
        
        case ACTION_TYPES.CLEAR_SELECTION: {
            const newGrid = state.grid.map(row =>
                row.map(seat => {
                    if (seat.status === SEAT_STATUS.SELECTED) {
                        return { ...seat, status: SEAT_STATUS.AVAILABLE };
                    }
                    return seat;
                })
            );
            
            try {
                localStorage.removeItem('selectedSeats');
            } catch (e) {
                console.error('Failed to clear selection from localStorage:', e);
            }
            
            return {
                ...state,
                grid: newGrid,
                selectedIds: new Set(),
                totalPrice: 0
            };
        }
        
        case ACTION_TYPES.RESET: {
            const freshGrid = createInitialGrid();
            return {
                ...initialState,
                grid: freshGrid,
                selectedIds: new Set(),
                totalPrice: 0
            };
        }
        
        case ACTION_TYPES.SET_FOCUSED_SEAT:
            return {
                ...state,
                focusedSeatId: action.payload
            };
        
        case ACTION_TYPES.SET_LOADING:
            return {
                ...state,
                isBooking: action.payload
            };
        
        default:
            return state;
    }
};

const SeatBooking = () => {
    const [state, dispatch] = useReducer(seatReducer, initialState);
    const [loading, setLoading] = useState(true);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const gridRef = useRef(null);
    
    useEffect(() => {
        const loadGrid = async () => {
            try {
                setLoading(true);
                const response = await seatService.getGrid();
                
                const savedSelection = localStorage.getItem('selectedSeats');
                let restoredSelectedIds = new Set();
                let restoredTotalPrice = 0;
                
                if (savedSelection) {
                    try {
                        const parsedSelection = JSON.parse(savedSelection);
                        if (Array.isArray(parsedSelection) && parsedSelection.length > 0) {
                            const validSeats = parsedSelection.filter(seatId => {
                                const [row, seat] = seatId.split('-').map(Number);
                                if (response.grid[row] && response.grid[row][seat]) {
                                    return response.grid[row][seat].status === SEAT_STATUS.AVAILABLE;
                                }
                                return false;
                            });
                            
                            if (validSeats.length > 0) {
                                restoredSelectedIds = new Set(validSeats);
                                
                                const gridWithSelections = response.grid.map(row =>
                                    row.map(seat => {
                                        if (restoredSelectedIds.has(seat.id)) {
                                            return { ...seat, status: SEAT_STATUS.SELECTED };
                                        }
                                        return seat;
                                    })
                                );
                                
                                restoredTotalPrice = calculateTotalPriceFromSeats(gridWithSelections, restoredSelectedIds);
                                
                                dispatch({
                                    type: ACTION_TYPES.INITIALIZE,
                                    payload: {
                                        grid: gridWithSelections,
                                        selectedIds: restoredSelectedIds,
                                        totalPrice: restoredTotalPrice
                                    }
                                });
                                
                                localStorage.setItem('selectedSeats', JSON.stringify(validSeats));
                                
                                setLoading(false);
                                return;
                            } else {
                                localStorage.removeItem('selectedSeats');
                            }
                        }
                    } catch (e) {
                        console.error('Failed to parse saved selection:', e);
                        localStorage.removeItem('selectedSeats');
                    }
                }
                
                dispatch({
                    type: ACTION_TYPES.INITIALIZE,
                    payload: {
                        grid: response.grid,
                        selectedIds: new Set(),
                        totalPrice: 0
                    }
                });
            } catch (error) {
                console.error('Failed to load grid:', error);
                toast.error('Failed to load seat grid');
                dispatch({
                    type: ACTION_TYPES.INITIALIZE,
                    payload: {
                        grid: createInitialGrid(),
                        selectedIds: new Set(),
                        totalPrice: 0
                    }
                });
            } finally {
                setLoading(false);
            }
        };
        
        loadGrid();
    }, []);
    
    useEffect(() => {
        if (state.grid && !state.focusedSeatId) {
            const firstSeatId = state.grid[0][0].id;
            dispatch({ type: ACTION_TYPES.SET_FOCUSED_SEAT, payload: firstSeatId });
        }
    }, [state.grid, state.focusedSeatId]);
    
    const handleSeatClick = useCallback(async (rowIndex, seatIndex) => {
        if (!isAuthenticated) {
            toast.error('Please login to select seats');
            navigate('/login');
            return;
        }

        const seat = state.grid[rowIndex][seatIndex];
        const currentStatus = seat.status;
        
        if (currentStatus === SEAT_STATUS.BOOKED) {
            return;
        }
        
        const isSelecting = currentStatus === SEAT_STATUS.AVAILABLE;
        const currentSelection = Array.from(state.selectedIds);
        
        if (isSelecting) {
            const isValidFrontend = validateGapFrontend(
                state.grid, 
                rowIndex, 
                seatIndex, 
                currentStatus, 
                currentSelection
            );
            
            if (!isValidFrontend) {
                toast.error('Cannot select this seat. It would create an isolated available seat.');
                return;
            }
        }
        
        try {
            await seatService.validateSelection(rowIndex, seatIndex, currentSelection);
            
            dispatch({ type: ACTION_TYPES.TOGGLE_SEAT, payload: { rowIndex, seatIndex } });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid seat selection';
            toast.error(errorMessage);
        }
    }, [state.grid, state.selectedIds, isAuthenticated, navigate]);
    
    const handleKeyDown = useCallback((e, rowIndex, seatIndex) => {
        const ROWS = 8;
        const SEATS_PER_ROW = 10;
        
        let newRowIndex = rowIndex;
        let newSeatIndex = seatIndex;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (rowIndex > 0) {
                    newRowIndex = rowIndex - 1;
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (rowIndex < ROWS - 1) {
                    newRowIndex = rowIndex + 1;
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (seatIndex > 0) {
                    newSeatIndex = seatIndex - 1;
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (seatIndex < SEATS_PER_ROW - 1) {
                    newSeatIndex = seatIndex + 1;
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleSeatClick(rowIndex, seatIndex);
                return;
            default:
                return;
        }
        
        const newSeatId = `${newRowIndex}-${newSeatIndex}`;
        dispatch({ type: ACTION_TYPES.SET_FOCUSED_SEAT, payload: newSeatId });
        
        const newSeatElement = document.getElementById(`seat-${newSeatId}`);
        if (newSeatElement) {
            newSeatElement.focus();
        }
    }, [handleSeatClick]);
    
    const handleBookSeatsClick = useCallback(() => {
        if (state.selectedIds.size === 0) return;
        
        if (!isAuthenticated) {
            toast.error('Please login to book seats');
            navigate('/login');
            return;
        }
        
        setShowConfirmationModal(true);
    }, [state.selectedIds.size, isAuthenticated, navigate]);
    
    const handleConfirmBooking = useCallback(async () => {
        if (state.selectedIds.size === 0) return;
        
        setShowConfirmationModal(false);
        
        try {
            dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
            const seatIds = Array.from(state.selectedIds);
            await seatService.bookSeats(seatIds);
            
            dispatch({ type: ACTION_TYPES.BOOK_SEATS });
            toast.success(`Successfully booked ${seatIds.length} seat(s)!`);
            
            try {
                localStorage.removeItem('selectedSeats');
            } catch (e) {
                console.error('Failed to clear selection from localStorage:', e);
            }
            
            const response = await seatService.getGrid();
            dispatch({
                type: ACTION_TYPES.INITIALIZE,
                payload: {
                    grid: response.grid,
                    selectedIds: new Set(),
                    totalPrice: 0
                }
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to book seats';
            toast.error(errorMessage);
        } finally {
            dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        }
    }, [state.selectedIds, isAuthenticated]);
    
    const handleClearSelection = useCallback(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_SELECTION });
    }, []);
    
    const handleReset = useCallback(async () => {
        if (!isAuthenticated) {
            toast.error('Please login to reset bookings');
            navigate('/login');
            return;
        }

        if (!window.confirm('Are you sure you want to reset all your bookings?')) {
            return;
        }

        try {
            await seatService.resetBookings();
            toast.info('All bookings have been reset');
            
            const response = await seatService.getGrid();
            dispatch({
                type: ACTION_TYPES.INITIALIZE,
                payload: {
                    grid: response.grid,
                    selectedIds: new Set(),
                    totalPrice: 0
                }
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reset bookings';
            toast.error(errorMessage);
        }
    }, [isAuthenticated, navigate]);
    
    const getSeatPrice = (rowLabel) => {
        for (const [tier, config] of Object.entries(PRICING_CONFIG)) {
            if (config.rows.includes(rowLabel)) {
                return config.price;
            }
        }
        return PRICING_CONFIG.ECONOMY.price;
    };
    
    const getSelectedCount = () => {
        return state.selectedIds.size;
    };
    
    const getBookedCount = () => {
        if (!state.grid) return 0;
        return state.grid.flat().filter(seat => seat.status === SEAT_STATUS.BOOKED).length;
    };
    
    const getAvailableCount = () => {
        if (!state.grid) return 0;
        return state.grid.flat().filter(seat => seat.status === SEAT_STATUS.AVAILABLE).length;
    };
    
    const calculateTotalPrice = () => {
        return state.totalPrice;
    };
    
    if (loading || !state.grid) {
        return (
            <div className="seat-booking-container" data-testid="seat-booking-container">
                <div style={{ textAlign: 'center', padding: '60px' }}>Loading seat grid...</div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors />
            <BookingConfirmationModal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleConfirmBooking}
                selectedSeats={Array.from(state.selectedIds)}
                totalPrice={state.totalPrice}
            />
        <div
            className="seat-booking-container"
            id="seat-booking-container"
            data-testid="seat-booking-container"
        >
            <h1 data-testid="app-title">GreenStitch Seat Booking System</h1>

            <div className="info-panel" data-testid="info-panel">
                <div className="info-item" data-testid="available-info">
                    <span className="info-label">Available:</span>
                        <span className="info-value" data-testid="available-count" aria-live="polite">
                        {getAvailableCount()}
                    </span>
                </div>
                <div className="info-item" data-testid="selected-info">
                    <span className="info-label">Selected:</span>
                        <span className="info-value" data-testid="selected-count" aria-live="polite">
                        {getSelectedCount()}
                    </span>
                </div>
                <div className="info-item" data-testid="booked-info">
                    <span className="info-label">Booked:</span>
                        <span className="info-value" data-testid="booked-count" aria-live="polite">
                        {getBookedCount()}
                    </span>
                </div>
            </div>


                <div 
                    className="seat-grid" 
                    data-testid="seat-grid"
                    role="grid"
                    aria-label="Seat selection grid"
                    ref={gridRef}
                >
                    {state.grid.map((row, rowIndex) => {
                    const rowLabel = String.fromCharCode(65 + rowIndex);
                    return (
                        <div
                            key={rowIndex}
                            className="seat-row"
                            data-testid={`seat-row-${rowLabel}`}
                            data-row-index={rowIndex}
                                role="row"
                                aria-label={`Row ${rowLabel}`}
                        >
                            <div
                                className="row-label"
                                data-testid={`row-label-${rowLabel}`}
                            >
                                {rowLabel}
                            </div>
                                {row.map((seat, seatIndex) => {
                                    const seatId = seat.id;
                                    const isFocused = state.focusedSeatId === seatId;
                                    const price = getSeatPrice(seat.rowLabel);
                                    const ariaLabel = `Row ${seat.rowLabel} Seat ${seatIndex + 1}, Price ₹${price}, ${seat.status === SEAT_STATUS.AVAILABLE ? 'Available' : seat.status === SEAT_STATUS.SELECTED ? 'Selected' : 'Booked'}`;
                                    
                                    return (
                                        <motion.button
                                    key={seat.id}
                                    id={`seat-${seat.id}`}
                                    className={`seat ${seat.status}`}
                                    data-testid="seat"
                                    data-seat-id={seat.id}
                                            data-seat-row={seat.rowLabel}
                                    data-seat-number={seatIndex + 1}
                                    data-seat-status={seat.status}
                                            role="gridcell"
                                            aria-label={ariaLabel}
                                            tabIndex={isFocused ? 0 : -1}
                                    onClick={() => handleSeatClick(rowIndex, seatIndex)}
                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, seatIndex)}
                                            onFocus={() => dispatch({ 
                                                type: ACTION_TYPES.SET_FOCUSED_SEAT, 
                                                payload: seatId 
                                            })}
                                            disabled={seat.status === SEAT_STATUS.BOOKED || state.isBooking}
                                            whileTap={{ scale: 0.95 }}
                                            animate={{ 
                                                scale: seat.status === SEAT_STATUS.SELECTED ? 1.05 : 1 
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {seatIndex + 1}
                                        </motion.button>
                                    );
                                })}
                        </div>
                    );
                })}
            </div>

            <div className="pricing-info" data-testid="pricing-info">
                <p data-testid="selected-total">
                    Selected Seats Total:{' '}
                        <strong data-testid="total-price" aria-live="polite">₹{calculateTotalPrice()}</strong>
                </p>
                <p className="price-note" data-testid="price-note">
                    Premium (A-C): ₹1000 | Standard (D-F): ₹750 | Economy (G-H): ₹500
                </p>
            </div>

            <div className="control-panel" data-testid="control-panel">
                <button
                    className="btn btn-book"
                    id="book-seats-button"
                    data-testid="book-seats-button"
                        onClick={handleBookSeatsClick}
                        disabled={getSelectedCount() === 0 || state.isBooking}
                >
                        {state.isBooking ? 'Booking...' : `Book Selected Seats (${getSelectedCount()})`}
                </button>
                <button
                    className="btn btn-clear"
                    id="clear-selection-button"
                    data-testid="clear-selection-button"
                    onClick={handleClearSelection}
                    disabled={getSelectedCount() === 0}
                >
                    Clear Selection
                </button>
                <button
                    className="btn btn-reset"
                    id="reset-all-button"
                    data-testid="reset-all-button"
                    onClick={handleReset}
                        disabled={state.isBooking}
                >
                    Reset All
                </button>
            </div>
        </div>
        </>
    );
};

export default SeatBooking;
