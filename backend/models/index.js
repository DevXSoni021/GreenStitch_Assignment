const sequelize = require('../config/database');
const User = require('./User');
const Booking = require('./Booking');
const Seat = require('./Seat');

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    console.log('⚠️  Continuing with existing database structure...');
  }
};

module.exports = {
  sequelize,
  User,
  Booking,
  Seat,
  syncDatabase
};

