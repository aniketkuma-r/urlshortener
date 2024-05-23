const URL = require("../models/url.model");
const { nanoid } = require("nanoid");

const handleGenerateNewSHortURL = async (req, res) => {
  const body = req.body;
  const redirectURL = body.url;
  let shortURL = null;

  if (!redirectURL)
    return res
      .status(400)
      .redirect(
        `http://localhost:8000/?error=${encodeURIComponent(
          "Original url is required."
        )}`
      );

  if (!body.shortURL) shortURL = nanoid(8);
  else {
    const existdocument = await URL.findOne({ shortURLId: body.shortURL });
    if (existdocument)
      return res
        .status(400)
        .redirect(
          `/?error=${encodeURIComponent(
            "This Path already exists. Please Try Something else."
          )}`
        );

    shortURL = body.shortURL;
  }
  await URL.create({
    shortURLId: shortURL,
    redirectURL: redirectURL,
    visitHistory: [],
    createdBy: req.user?._id,
  });
  return res
    .status(201)
    .redirect(
      `/?success=${encodeURIComponent(shortURL)}`
    );
};

const handleRedirectToOrignalURL = async (req, res) => {
  const shortURLId = req.params.shortURLId;
  const document = await URL.findOneAndUpdate(
    { shortURLId },
    {
      $push: {
        visitHistory: {
          time: Date.now(),
        },
      },
    }
  );
  if (document) return res.redirect(document.redirectURL);
  return res.status(400).json({ error: "shortURL doesn't exists !!" });
};

const handleGetAnalytics = async (req, res) => {
  const shortURLId = req.params.shortURLId;
  const document = await URL.findOne({ shortURLId });
  if (document) {
    return res.json({
      numberofvisits: document.visitHistory.length,
      anayltics: document.visitHistory,
    });
  }
  return res.status(400).json({ error: "this shorturl doesn't exist" });
};

module.exports = {
  handleGenerateNewSHortURL,
  handleRedirectToOrignalURL,
  handleGetAnalytics,
};
