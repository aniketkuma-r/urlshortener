const express = require("express");
const router = express.Router();

const { handleRedirectToOrignalURL } = require("../controllers/url.controller");
const URL = require("../models/url.model");
const { restrictTo } = require("../middlewares/auth.middleware");

router.get("/", async (req, res) => {
  if (!req.user) return res.render("home");
  
  const error = req.query.error;
  const success = req.query.success;
  const URLs = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: URLs,
    user: req.user,
    error,
    shortURL: success,
    reqInfo: `${req.protocol}://${req.headers.host}`,
  });
});

router.get("/a/signup", (req, res) => {
  res.render("signup");
});

router.get("/a/login", (req, res) => {
  res.render("login");
});

router.get("/a/admin", restrictTo(["ADMIN"]) ,async (req, res) => {
  const allURLs = await URL.find({});
  res.render("home", {
    urls: allURLs,
    user: req.user,
    reqInfo: `${req.protocol}://${req.headers.host}`,
  });
});

router.get("/:shortURLId", handleRedirectToOrignalURL);

module.exports = router;
