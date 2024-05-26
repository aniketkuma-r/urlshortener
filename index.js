require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectToMongo } = require("./connection");
const urlRoute = require("./routes/url.route");
const userRoute = require("./routes/user.route");
const homeRoute = require("./routes/home.route");
const {
  checkForAuthentication,
  restrictTo,
} = require("./middlewares/auth.middleware");

// connections
const app = express();
const PORT = process.env.PORT;
connectToMongo(process.env.MONGO_URL).then(() =>
  console.log("mongoDB connected !!")
);

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthentication);

// routes
app.use("/url", restrictTo(["USER", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", homeRoute);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
