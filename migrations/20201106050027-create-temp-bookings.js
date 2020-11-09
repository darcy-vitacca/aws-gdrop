"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TempBookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookingTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      buyerEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      buyerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      buyerNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      item: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      marketplace: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      selectedDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TempBookings");
  },
};
