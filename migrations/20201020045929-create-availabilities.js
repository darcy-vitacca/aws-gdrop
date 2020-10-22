'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('availabilities', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      end: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('availabilities');
  }
};