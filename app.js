const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")
const router = require("./routes/blogsroutes.js");
const flash = require("express-flash");
const passportInitializer = require("./passportlocal-config.js");
const session = require("express-session");
const app = express();
const dotenv = require("dotenv");
const passport = require("passport");
const Usercred = require("./models/usercredentials.js");
dotenv.config();
const PORT = 3000;
const DbConnect = process.env.DB_CONNECTION_STRING;
app.set("view engine", "ejs");
mongoose
  .connect(DbConnect)
  .then(() => {
    app.listen(PORT, () => {
      console.log("App is listening on port" + PORT);
    });
    console.log("connected Database succesfully");
  })
  .catch((err) => console.log("error while connecting database", err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //serving static files to frontend any files placed inside public folder can be accessed using express.static middleware

const finduserbymail = async (email) => {
  try {
    const user = await Usercred.findOne({ email });
    return user;
  } catch (error) {
    console.log("error finding user", error);
    return null;
  }
};

const finduserbyid = async (id) => {
  try {
    const userid = await Usercred.findById(id);
    return userid;
  } catch (error) {
    console.log("error finding", error);
    return null;
  }
};

passportInitializer(passport, finduserbymail, finduserbyid);

app.use(
  session({
    secret: "authenticationforblogs",
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
      mongoUrl:process.env.DB_CONNECTION_STRING,
      collectionName:"sessions",
      ttl: 3600,
    }),
    cookie:({secure:false}),
    maxAge:3600000
  })
);
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  // res.sendFile('./nonja/views/index.html',{root:__dirname})       //sending static files to a site
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  // res.sendFile('./nonja/views/about.html',{root:__dirname})
  res.render("about", { title: "About" });
});

app.use(router);

app.use((req, res) => {
  // res.status(404).sendFile("./nonja/views/404.html",{root:__dirname})
  res.render("404", { title: "404" });
});
