var express = require("express");
const services = require("./../service");
var router = express.Router();

router.post("/signUp", services.registerUser);

router.post("/login", services.loginUser);
router.get("/revealData", services.revealData);
router.get("/email", services.email);
router.put("/forgotPassword", services.forgotPassword);
router.get("/bookListData", services.bookListData);

module.exports = router;
