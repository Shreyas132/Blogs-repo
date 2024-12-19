const Blogs = require("../models/blogs");

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
    const newblogs = new Blogs({ title, snippet, bbody });
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
    const deleteone = await Blogs.findByIdAndDelete(userId);
    if (!deleteone) return res.status(404).send("no details to delete");
    res.json({ redirect: "/blogs" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {handledelete,handleformcretetemplate,handlegetall,handlegetone,handlepost}
