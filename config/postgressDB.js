const { Sequelize } = require("sequelize");

const production = {
  database: process.env.ONLINE_DB_DATABASE_NAME,
  username: process.env.ONLINE_DB_USERNAME,
  password: process.env.ONLINE_DB_PASSWORD,
};

const prodHost = process.env.ONLINE_DB_HOST;

const devHost = process.env.DB_HOST;

const development = {
  database: process.env.DB_DATABASE_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

const sequelize = new Sequelize(
  process.env.NODE_ENV === "production" ? production.database : development.database,
  process.env.NODE_ENV === "production"? production.username : development.username,
  process.env.NODE_ENV === "production"? production.password : development.password,

  {
    host: process.env.NODE_ENV === "production" ? prodHost : devHost,
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
