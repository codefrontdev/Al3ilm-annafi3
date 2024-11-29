const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgressDB");
const User = require("./userModel");
const Video = require("./VideoModel");




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
    modelName: "User",
    timestamps: true,
  }
);


 Theme.hasMany(Video, {
      foreignKey: 'themeId',
      as: 'videos',
    });

    Theme.hasMany(Video, {
      foreignKey: 'queueThemeId',
      as: 'videosQueue',
    });
  

module.exports = Theme;