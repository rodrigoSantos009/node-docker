const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.getUsers);
router.post("/signup", authController.signUp);
router.post("/login", authController.login);


module.exports = router;
