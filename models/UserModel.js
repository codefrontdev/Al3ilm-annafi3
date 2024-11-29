const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgressDB");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePic: DataTypes.STRING,
    deletedVideos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    message: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

module.exports = User;
