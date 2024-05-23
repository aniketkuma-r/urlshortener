const User = require("../models/user.model");
const { setUser } = require("../services/auth.service");

const handleUserSignUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res
      .status(400)
      .render("signup", { error: "Confirm Password is not matching. !!" });

  const existUser = await User.findOne({ email });
  if (existUser)
    return res
      .status(400)
      .render("signup", { error: "User with this email already exists !!" });

  await User.create({
    name,
    email,
    password,
  });
  return res
    .status(201)
    .render("signup", { success: true });
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).render("login", {
      error: "Invalid User credential. !!",
    });
  }

  const token = setUser(user);
  res.cookie("token", token);
  res.redirect("/");
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
