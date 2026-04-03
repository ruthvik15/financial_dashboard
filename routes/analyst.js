const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const analystController = require("../controllers/analystController");

router.get("/query", auth, authorize(["Analyst"]), analystController.query);

module.exports = router;