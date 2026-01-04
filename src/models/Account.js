import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Account = sequelize.define(
  "Account",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    accountNumber: { type: DataTypes.INTEGER, unique: true },
    balance: DataTypes.DECIMAL(10, 2),
  },
  { timestamps: false }
);

export default Account;
