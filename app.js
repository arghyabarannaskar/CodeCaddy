require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./server/config/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const app = express();

const port = 3000 || process.env.PORT;

app.use(
  session({
    secret: "lsajokfmokmvad",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect to database
connectDB();

const path = require("path");

app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static("public"));

//Templating engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//Routes
app.use("/", require("./server/routes/index"));
app.use("/dashboard", require("./server/routes/dashboard"));
app.use("/", require("./server/routes/auth"));

//Handle 404
app.get("*", async (req, res) => {
  const locals = {
    title: "404 Page Not Found",
    description: "The page does not exist",
  };
  res.status(404).render("404", { locals, layout: "layouts/404layout.ejs" });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
