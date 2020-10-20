'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  bookings.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bookingConfirmed :{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Bookings',
    tableName: 'bookings'
  });
  return bookings;
};