const express = require("express");
const router = express.Router();
const recommend = require("./database/recommended.js");
const nodemailer = require("nodemailer");
const url = require("url");
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "businessenligne226@gmail.com",
    pass: "lesage226",
  },
});

router.get("/", (req, res) => {
  res.render("recommend");
});

router.post("/", async function (req, res) {
  const recommendation = new recommend({
    userName: req.body.name,
    Email: req.body.email,
    bookTitle: req.body.bookname,
    Author: req.body.author,
    category: req.body.categories,
  });

  try {
    await recommendation.save();
    const option = {
      from: "businessenligne226@gmail.com",
      to: req.body.email,
      subject: `Hello ${req.body.name},Votre Libra Recommendation`,
      html:
        "<h4> Libra: Votre Bibiliotheque</h4>" +
        "<p>Vous remercie Pour votre visiste</p>" +
        "<p>Votre recommendation sera prise en compte</p>" +
        "<p>Merci!, A bientot</p>",
    };
    transport.sendMail(option, function (err, info) {
      if (err) throw err;
      console.log("Email sent");
    });
    res.render("recommend", {
      layouts: false,
      output: "success",
      message: "Recommendation made",
    });
  } catch {
    res.render("recommend", {
      layouts: false,
      output: "fail",
      message: "Error !",
    });
    console.log("error");
  }
});

router.get("/books", async function (req, res) {
  try {
    const books = await recommend.find().limit(15);
    res.render("RecommendPage", { layouts: false, books: books });
  } catch {
    console.log("Recommendations can not be fecthed");
  }
});

router.get("/delete", async function (req, res) {
  const id = url.parse(req.url, true).query.query;
  try {
    const del = await recommend.deleteOne({ _id: id });
    res.redirect("/");
    console.log(del);
  } catch {
    console.log("Fail to delete");
  }
});

module.exports = router;
