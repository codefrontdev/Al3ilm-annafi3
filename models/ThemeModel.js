const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgressDB");

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Theme",
    timestamps: true,
  }
);

module.exports = Theme;
