import sequelize from "../config/database.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import { User } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Op } from "sequelize";

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

    // Create sender's debit transaction
    await Transaction.create(
      {
        fromAccount: sender.accountNumber,
        toAccount: receiver.accountNumber,
        amount,
        type: "debit",
      },
      { transaction: t }
    );

    // Create receiver's credit transaction
    await Transaction.create(
      {
        fromAccount: sender.accountNumber,
        toAccount: receiver.accountNumber,
        amount,
        type: "credit",
      },
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
  const { page = 1, limit = 10 } = req.query;

  const account = await Account.findOne({
    where: { userId: req.user.id },
    include: [{ model: User, attributes: ["name", "email"] }],
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  const offset = (page - 1) * limit;

  // Get transactions where:
  // - User sent money (fromAccount matches AND type is debit)
  // - User received money (toAccount matches AND type is credit)
  // - User deposited/withdrew (fromAccount = toAccount)
  const { count, rows: txns } = await Transaction.findAndCountAll({
    where: {
      [Op.or]: [
        {
          fromAccount: account.accountNumber,
          type: { [Op.in]: ["debit", "withdrawal", "deposit"] },
        },
        {
          toAccount: account.accountNumber,
          type: "credit",
        },
      ],
    },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  // Get sender and receiver details for each transaction
  const enrichedTxns = await Promise.all(
    txns.map(async (txn) => {
      let otherPartyName = "Unknown";
      let otherPartyAccount = null;
      let displayType = txn.type;

      if (txn.type === "withdrawal" || txn.type === "deposit") {
        displayType = txn.type;
        otherPartyName = "Self";
        otherPartyAccount = account.accountNumber;
      } else if (txn.type === "debit") {
        // User sent money
        displayType = "sent";
        const receiverAccount = await Account.findOne({
          where: { accountNumber: txn.toAccount },
          include: [{ model: User, attributes: ["name", "email"] }],
        });
        otherPartyName = receiverAccount?.User?.name || "Unknown";
        otherPartyAccount = txn.toAccount;
      } else if (txn.type === "credit") {
        // User received money
        displayType = "received";
        const senderAccount = await Account.findOne({
          where: { accountNumber: txn.fromAccount },
          include: [{ model: User, attributes: ["name", "email"] }],
        });
        otherPartyName = senderAccount?.User?.name || "Unknown";
        otherPartyAccount = txn.fromAccount;
      }

      return {
        id: txn.id,
        amount: txn.amount,
        type: displayType,
        fromAccount: txn.fromAccount,
        toAccount: txn.toAccount,
        otherPartyName,
        otherPartyAccount,
        createdAt: txn.createdAt,
      };
    })
  );

  res.json({
    success: true,
    data: {
      transactions: enrichedTxns,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    },
  });
});
