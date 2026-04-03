const express  = require("express");
const router   = express.Router();
const { auth, authorize } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", auth, authorize(["Admin"]), adminController.getUsers);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update a user's role
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.patch("/users/:id/role", auth, authorize(["Admin"]), adminController.updateRole);

/**
 * @swagger
 * /admin/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.patch("/users/:id/deactivate", auth, authorize(["Admin"]), adminController.deActivateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/users/:id", auth, authorize(["Admin"]), adminController.deleteUser);

/**
 * @swagger
 * /admin/records:
 *   get:
 *     summary: Get all records
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type (income, expense)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Max number of items per page
 *     responses:
 *       200:
 *         description: List of records
 */
router.get("/records", auth, authorize(["Admin"]), adminController.getRecords);

/**
 * @swagger
 * /admin/records:
 *   post:
 *     summary: Add a new record
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Record added
 */
router.post("/records", auth, authorize(["Admin"]), adminController.addRecord);

/**
 * @swagger
 * /admin/records/{id}:
 *   patch:
 *     summary: Update a record
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated
 */
router.patch("/records/:id", auth, authorize(["Admin"]), adminController.updateRecord);

/**
 * @swagger
 * /admin/records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete("/records/:id", auth, authorize(["Admin"]), adminController.deleteRecord);

module.exports = router;

