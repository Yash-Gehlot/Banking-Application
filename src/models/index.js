import User from "./User.js";
import Account from "./Account.js";
import Transaction from "./Transaction.js";

User.hasOne(Account, { foreignKey: "userId" });
Account.belongsTo(User, { foreignKey: "userId" });

Account.hasMany(Transaction, {
  foreignKey: "fromAccount",
  sourceKey: "accountNumber",
  as: "sentTransactions",
});
Account.hasMany(Transaction, {
  foreignKey: "toAccount",
  sourceKey: "accountNumber",
  as: "receivedTransactions",
});

export { User, Account, Transaction };
