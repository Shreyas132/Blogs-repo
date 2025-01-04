const express = require("express");
const router = express.Router();
const {
  handledelete,
  handleformcretetemplate,
  handlegetall,
  handlegetone,
  handlepost,
  renderregister,
  handleuserregister,
  renderlogin,
  handlelogin,
  handlelogout
} = require("../controllers/controllers");
//to post or to create a new blog
router.post("/blogs", handlepost);

//to get all blogs
router.get("/blogs", handlegetall);
router.get("/blogs/create",checkauthentication, handleformcretetemplate);

//to get a single blog using id parameter
router.get("/blogs/:id", handlegetone);

//to delete a single blog
router.delete("/blogs/:id",checkauthentication, handledelete);

router.get("/register",renderregister);
router.post("/register",handleuserregister);
router.get("/login",renderlogin);
router.post("/login",handlelogin);
router.post("/logout",handlelogout)

function checkauthentication (req, res, next){
  console.log("authentication",req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl
  res.redirect("/login");
};


module.exports = router;
