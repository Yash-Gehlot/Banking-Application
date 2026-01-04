import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import Account from "../models/Account.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  res.json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findByPk(req.user.id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;

  const user = await User.findByPk(req.user.id);

  const isValid = await bcrypt.compare(current_password, user.password);
  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(new_password, 10);
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});
