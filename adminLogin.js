const express = require("express");
const { render } = require("./bookAdd.js");
const router = express.Router();
const Admin = require("./database/admin.js");
const bcrypt = require("bcryptjs");
const bookCollection = require("./database/newBook");
const recommend = require("./database/recommended.js");
const url = require("url");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

var status = "False";
var IDS;
router.get("/", function (req, res) {
  console.log(status);
  if (status === "False") {
    res.render("adminLogin", { layouts: false });
  } else {
    res.redirect("/users/xyzadmin");
  }
});

router.get("/xyzadmin", async (req, res) => {
  console.log("admin", status);
  if (status === "False") {
    res.render("adminLogin", { layouts: false });
  } else {
    const count = await bookCollection.find().countDocuments();
    const book = await bookCollection.find().limit(4);
    const counter = await recommend.find().countDocuments();
    res.render("adminDashboard", {
      layouts: false,
      count: count,
      counter: counter,
      books: book,
    });
  }
});

router.post("/", async function (req, res) {
  const Match = await Admin.findOne({ user: req.body.name });
  const compare = await bcrypt.compare(req.body.code, Match.accessCode);
  // try {
  if (compare) {
    res.redirect("/users/xyzadmin");
    status = "True";
  }
  // } catch {
  else {
    res.render("adminLogin", {
      layouts: false,
      output: "false",
      message: "User name or Access code invalid",
    });
  }
  // }
  // console.log(Match.accessCode);
});

router.get("/newuser", (req, res) => {
  res.render("newAdmin", { layouts: false });
});

router.post("/new", async function (req, res) {
  //   if (
  //     (req.body.name != null || req.body.name != " ") &&
  //     (req.body.code != null || req.body.code != " ") &&
  //     (req.body.role != null || req.body.name != " ")
  //   ) {
  const newadmin = new Admin({
    user: req.body.name,
    role: req.body.role,
    accessCode: req.body.code,
    // });
  });
  try {
    const saveResult = await newadmin.save();
    // console.log(saveResult);
    res.render("newAdmin", {
      layouts: false,
      output: "success",
      message: "User Created",
    });
  } catch {
    res.render("newAdmin", {
      layouts: false,
      output: "fail",
      message: "This User cannot Created, Please  try again",
    });
  }
});

router.get("/out", (req, res) => {
  status = "False";
  console.log(status);
  res.redirect("/");
});

router.get("/books", async function (req, res) {
  try {
    const books = await bookCollection.find().limit(10);
    res.render("Allbooks", { layouts: false, books: books });
  } catch {
    console.log("Cannot get book collections");
  }
});

router.get("/delete", async function (req, res) {
  const id = url.parse(req.url, true).query.query;
  try {
    const del = await bookCollection.deleteOne({ _id: id });
    res.redirect("/users/xyzadmin");
    console.log("Livre supprimmer");
  } catch {
    console.log("Fail to delete");
  }
});

router.get("/update", async function (req, res) {
  IDS = url.parse(req.url, true).query.query;
  console.log("get", IDS);
  const el = req.body;
  const book = await bookCollection.find({ _id: IDS });
  // console.log(book);
  res.render("update", { book: book });
  console.log("Update rendered");
});

router.post("/update", async function (req, res) {
  // const id = url.parse(req.url, true).query.query;
  const book = await bookCollection.findById(IDS);
  console.log("pOST", IDS);
  const el = req.body;
  console.log(book);
  // console.log(el);
  if (!book) return;

  book.set({
    nomDulivre: el.name,
    nomDuAuteur: el.author,
    annee: el.Annee,
    link: el.link,
    description: el.comment,
    categories: el.categories,
  });

  updateCover(book, req.body.photo);

  try {
    await book.save();
    res.redirect("/users/xyzadmin");
    console.log("Livre supprimmer");
  } catch {
    console.log("Fail to delete");
  }
});
function updateCover(book, coverEncoded) {
  // if cover is not well encoded
  if (coverEncoded == null) return;

  const cover = JSON.parse(coverEncoded);

  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
