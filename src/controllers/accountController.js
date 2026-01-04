import { User } from "../models/index.js";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

export const getBalance = asyncHandler(async (req, res) => {
  const account = await Account.findOne({ where: { userId: req.user.id } });
  res.json({
    success: true,
    data: {
      balance: account.balance,
      accountNumber: account.accountNumber,
    },
  });
});

export const withdraw = asyncHandler(async (req, res) => {
  const { amount, password } = req.body;

  const user = await User.findByPk(req.user.id);
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });
  }

  const account = await Account.findOne({ where: { userId: req.user.id } });

  if (account.balance < amount) {
    return res
      .status(400)
      .json({ success: false, message: "Insufficient balance" });
  }

  account.balance -= amount;
  await account.save();

  await Transaction.create({
    fromAccount: account.accountNumber,
    toAccount: account.accountNumber,
    amount,
    type: "withdrawal",
  });

  res.json({
    success: true,
    message: "Withdrawal successful",
    balance: account.balance,
  });
});

export const deposit = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const account = await Account.findOne({ where: { userId: req.user.id } });

  account.balance = parseFloat(account.balance) + parseFloat(amount);
  await account.save();

  await Transaction.create({
    fromAccount: account.accountNumber,
    toAccount: account.accountNumber,
    amount,
    type: "deposit",
  });

  res.json({
    success: true,
    message: "Deposit successful",
    balance: account.balance,
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findByPk(req.user.id);
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });
  }

  const account = await Account.findOne({ where: { userId: req.user.id } });

  await Transaction.destroy({ where: { fromAccount: account.accountNumber } });
  await account.destroy();
  await user.destroy();

  res.json({
    success: true,
    message: "Account deleted successfully",
  });
});
