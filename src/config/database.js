import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "banking_system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "yash gehlot",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
