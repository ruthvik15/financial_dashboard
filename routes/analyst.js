const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const analystController = require("../controllers/analystController");

/**
 * @swagger
 * /analyst/query:
 *   post:
 *     summary: Run an arbitrary analytical query
 *     tags: [Analyst]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: SQL query string
 *     responses:
 *       200:
 *         description: Query executed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/query", auth, authorize(["Admin", "Analyst"]), analystController.analystController);

module.exports = router;