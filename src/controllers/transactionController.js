import sequelize from "../config/database.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const transferMoney = asyncHandler(async (req, res) => {
  const { toAccount, amount } = req.body;

  if (!toAccount || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid transfer details",
    });
  }

  const t = await sequelize.transaction();

  try {
    const sender = await Account.findOne({
      where: { userId: req.user.id },
      transaction: t,
    });

    if (!sender) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Your account not found",
      });
    }

    const receiver = await Account.findOne({
      where: { accountNumber: toAccount },
      transaction: t,
    });

    if (!receiver) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Recipient account not found",
      });
    }

    if (sender.accountNumber === receiver.accountNumber) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to same account",
      });
    }

    if (parseFloat(sender.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    sender.balance = parseFloat(sender.balance) - parseFloat(amount);
    receiver.balance = parseFloat(receiver.balance) + parseFloat(amount);

    await sender.save({ transaction: t });
    await receiver.save({ transaction: t });

    await Transaction.create(
      { fromAccount: sender.accountNumber, toAccount, amount, type: "debit" },
      { transaction: t }
    );

    await Transaction.create(
      { fromAccount: sender.accountNumber, toAccount, amount, type: "credit" },
      { transaction: t }
    );

    await t.commit();
    res.json({
      success: true,
      message: "Transfer successful",
      data: {
        amount,
        newBalance: sender.balance,
      },
    });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

export const history = asyncHandler(async (req, res) => {
  const account = await Account.findOne({ where: { userId: req.user.id } });

  const txns = await Transaction.findAll({
    where: { fromAccount: account.accountNumber },
    order: [["id", "DESC"]],
  });

  res.json({
    success: true,
    data: { transactions: txns },
  });
});
