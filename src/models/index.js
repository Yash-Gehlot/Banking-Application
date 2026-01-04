import User from "./User.js";
import Account from "./Account.js";

User.hasOne(Account, { foreignKey: "userId" });
Account.belongsTo(User, { foreignKey: "userId" });

export { User, Account };
