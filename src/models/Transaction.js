import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fromAccount: DataTypes.INTEGER,
    toAccount: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
    type: DataTypes.STRING,
  },
  { timestamps: true }   
);

export default Transaction;