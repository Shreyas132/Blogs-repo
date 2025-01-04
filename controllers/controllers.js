const Blogs = require("../models/blogs");
const Usercred = require("../models/usercredentials");
const bcrypt = require("bcrypt");
const passport = require("passport");

const handlegetall = async (req, res) => {
  try {
    const findblog = await Blogs.find({});
    if (!findblog) return res.status(404).send("Error finding Details");
    res.render("index", { title: "All Blogs", blogs: findblog }); // title sending to header.ejs and findblog sending as blogs to index.js
    // res.status(200).send(findblog)
  } catch (error) {
    res.status(500).send("internal server error");
  }
};
const handleformcretetemplate = (req, res) => {
  // res.redirect("/about")
  res.render("create-blog", { title: "Create new blog" });
};

const handlepost = async (req, res) => {
  console.log(req.body);
  try {
    const { title, snippet, bbody } = req.body;
    if (!title || !snippet || !bbody)
      return res.status(400).send("Title,snippet and bbody must not be empty");
    const newblogs = new Blogs({ title, snippet, bbody, userId: req.user._id });
    await newblogs.save();
    res.redirect("/blogs");
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

const handlegetone = async (req, res) => {
  const userId = req.params.id;
  try {
    const findone = await Blogs.findById(userId);
    if (!findone) return res.status(404).send("User not found");
    res.render("details", { blogs: findone, title: "Detail" });
  } catch (error) {
    res.status(500).send("Internal Server error");
  }
};

const handledelete = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleteone = await Blogs.findById(userId);
    if (!deleteone) {
      res.status(404).send("blog not found");
    }
    if (deleteone.userId.toString() !== req.user._id.toString())
      res.status(403).json({error:"you are not authorised to delete"});
    await Blogs.findByIdAndDelete(userId);
    if (!deleteone) return res.status(404).send("no details to delete");
    res.json({ redirect: "/blogs"});
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
const renderregister = (req, res) => {
  res.render("register", { title: "user Registration" });
};

const handleuserregister = async (req, res) => {
  const saltrounds = 10;
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .send("name ,email and password fields should not be empty");
    const hashedpassword = await bcrypt.hash(password, saltrounds);
    const createnew = new Usercred({ name, email, password: hashedpassword });
    await createnew.save();
    console.log(createnew);
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
const renderlogin = (req, res) => {
  res.render("login", { title: "user Login" });
};

const handlelogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      const returnTo = req.session.returnTo || "/blogs/create";
      delete req.session.returnTo;
      return res.redirect(returnTo);
    });
  })(req, res, next);
};

const handlelogout = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.log("error during log out");
        return res.status(500).send("error during logout");
      }

      req.session.destroy((err) => {
        if (err) {
          console.log("error while destroying session", err);
          return res.status(500).send("failed to destroy session");
        }
        res.clearCookie("connect.sid");
        // req.flash("succes","you have been logged out succesfully")
        res.redirect("/blogs");
      });
    });
  } catch (error) {
    console.log("error while logging out", error);
    res.status(500).send("internal server error");
  }
};

module.exports = {
  handledelete,
  handleformcretetemplate,
  handlegetall,
  handlegetone,
  handlepost,
  renderregister,
  handleuserregister,
  renderlogin,
  handlelogin,
  handlelogout,
};
