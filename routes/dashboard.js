const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");


/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get financial dashboard analytics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Returns dashboard metrics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", auth, authorize(["User", "Admin", "Viewer"]), dashboardController.getDashboard);

module.exports = router;
