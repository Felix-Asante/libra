const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express"),
  _handlebars = require("handlebars"),
  expressHandlebars = require("express-handlebars"),
  {
    allowInsecurePrototypeAccess,
  } = require("@handlebars/allow-prototype-access");
const app = express();
const book = require("./bookAdd.js");
const bookCollection = require("./database/newBook.js");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const routes = require("./adminLogin.js");
const admindb = require("./database/admin.js");
const recommendRoutes = require("./recommendation.js");
const NewRecommendation = require("./database/recommended.js");

const PORT = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, "public")));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ limit: "3mb", extended: false }));

// app.engine("handlebars", exphbs());
app.engine(
  "handlebars",
  expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(_handlebars),
  })
);
app.set("view engine", "handlebars");

// index page
app.get("/", async function (req, res) {
  const bookList = await bookCollection.find().limit(10);
  // console.log(bookList);
  res.render("home", { layouts: false, bookList: bookList });
});

app.get("/add", (req, res) => {
  res.render("addNewBook");
});

// app.get("/newAdmin", (req, res) => {
//   res.render("newAdmin");
// });

app.listen(PORT, () => {
  console.log("Server Live");
});
/******************************* */

app.post("/research", async function (req, res) {
  // console.l
  const results = await bookCollection.find({
    $text: { $search: req.body.search },
  });
  res.render("home", {
    layouts: false,
    results: results,
    state: "/",
    content: "All Book",
  });
  console.log(results);
});
// app.get("/recommend", (req, res) => {
//   res.render("recommend");
// });

/****************************** */
// INIT ADMIN ROUTER
app.use("/users", routes);
app.use("/recommend", recommendRoutes);
// DATABASE CONNECTION
const MONGODB_URI =
  "mongodb+srv://felix:mongodbproject@project.jqnrn.mongodb.net/Libra?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => console.log("error: ", err));

// ADD BOOKS

app.post("/newbook", async (req, res) => {
  const book = new bookCollection({
    nomDuLivre: req.body.name,
    nomDuAuteur: req.body.author,
    annee: req.body.Annee,
    description: req.body.comment,
    link: req.body.link,
    categories: req.body.categories,
  });

  saveCover(book, req.body.photo);

  try {
    const addNewBook = await book.save();
    res.render("addNewBook");
  } catch {
    console.log("error");
  }
});

function saveCover(book, coverEncoded) {
  // if cover is not well encoded
  if (coverEncoded == null) return;

  const cover = JSON.parse(coverEncoded);

  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}
