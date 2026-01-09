const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  seat_ids: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('seat_ids must be an array');
        }
      },
      isValidSeatIds(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('seat_ids must be a non-empty array');
        }
        if (value.length > 8) {
          throw new Error('Cannot book more than 8 seats');
        }
        value.forEach(seatId => {
          if (typeof seatId !== 'string' || !/^\d+-\d+$/.test(seatId)) {
            throw new Error(`Invalid seat ID format: ${seatId}`);
          }
        });
      }
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'confirmed',
    allowNull: false
  },
  booking_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['booking_date']
    }
  ]
});

module.exports = Booking;

