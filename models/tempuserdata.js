"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TempUserData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TempUserData.init(
    {
      contactMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      handle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      enquiry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TempUserData",
      tableName: "tempuserdata",
    }
  );
  return TempUserData;
};
