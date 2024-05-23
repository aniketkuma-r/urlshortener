const express = require("express");
const router = express.Router();
const {
  handleGenerateNewSHortURL,
  handleGetAnalytics,
} = require("../controllers/url.controller");

router.post("/", handleGenerateNewSHortURL);

router.get("/analytics/:shortURLId", handleGetAnalytics);

module.exports = router;
