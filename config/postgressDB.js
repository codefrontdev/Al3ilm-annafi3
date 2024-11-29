const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "123456789", {
  host: "localhost",
  // port: 5432,
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: false,
  },
});

sequelize.sync({ force: false, alter: true });
const connection = async () => {
  try {
    await sequelize.authenticate();

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connection };
