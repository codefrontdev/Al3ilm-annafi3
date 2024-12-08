const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgressDB");
const User = require("./UserModel");
const Theme = require("./ThemeModel"); // تأكد من المسار الصحيح

const Video = sequelize.define(
  "Video",
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
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: DataTypes.STRING,
    reference: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ["approved", "rejected"],
      defaultValue: null,
    }
  },
  {
    sequelize,
    modelName: "Video",
    timestamps: true,
  }
);

Video.belongsTo(User, { foreignKey: "uploaderId", as: "uploader" });

Video.belongsToMany(Theme, {
  through: "video_themes",
  foreignKey: "videoId",
  as: "themes",
});

Theme.belongsToMany(Video, {
  through: "video_themes",
  foreignKey: "themeId",
  as: "videos",
});

module.exports = Video;
