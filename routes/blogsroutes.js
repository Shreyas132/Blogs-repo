const express = require("express");
const router = express.Router();
const {
  handledelete,
  handleformcretetemplate,
  handlegetall,
  handlegetone,
  handlepost,
} = require("../controllers/controllers");
//to post or to create a new blog
router.post("/blogs",handlepost);

//to get all blogs
router.get("/blogs",handlegetall);
router.get("/blogs/create",handleformcretetemplate);

//to get a single blog using id parameter
router.get("/blogs/:id",handlegetone );

//to delete a single blog
router.delete("/blogs/:id",handledelete);


module.exports = router;
