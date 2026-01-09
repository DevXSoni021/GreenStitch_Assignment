const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  row_label: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: [['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']]
    }
  },
  seat_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  last_booked_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  last_booked_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'seats',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['row_label', 'seat_number']
    }
  ]
});

Seat.beforeCreate((seat) => {
  if (!seat.id) {
    seat.id = `${seat.row_label}${seat.seat_number}`;
  }
});

module.exports = Seat;

