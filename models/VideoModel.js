


const { DataTypes } = require("sequelize");

const {sequelize} = require("../config/postgressDB");
const User = require("./userModel");

const Video = sequelize.define(
  "video",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    themes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        len: [1, 3],
      },
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: DataTypes.STRING,
    reference: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Video",
    timestamps: true,
  }
);

Video.belongsTo(User, { foreignKey: "uploaderId", as: "uploader" });
module.exports = Video;
