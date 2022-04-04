const express = require('express');
const router = express.Router();


const urlController= require("../controllers/urlController")

//create short url
router.post("/url/shorten",urlController.urlShort);
//get url
router.get("/:urlCode",urlController.getUrl);


module.exports = router;