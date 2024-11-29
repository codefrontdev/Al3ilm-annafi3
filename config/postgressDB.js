const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "al3ilmannafi3",
  "al3ilmannafi3_user",
  "6S1WNZHUqmT6aa6iYO9xYJa8mlRyXkg6",
  {
    host: "dpg-ct4q8uu8ii6s73dfdl9g-a",
    // port: 5432,
    dialect: "postgres",
    logging: false,
    define: {
      timestamps: false,
    },
  }
);

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
