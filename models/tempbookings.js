"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TempBookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TempBookings.init(
    {
      bookingTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buyerEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buyerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buyerNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      item: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      marketplace: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      selectedDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "tempbookings",
      modelName: "TempBookings"
    }
  );
  return TempBookings;
};
