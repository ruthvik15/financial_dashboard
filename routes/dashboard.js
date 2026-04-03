const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");


router.get("/", auth, authorize(["User", "Admin", "Analyst"]), dashboardController.getDashboard);
module.exports = router;
