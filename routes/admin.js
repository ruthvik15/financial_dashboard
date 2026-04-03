const express  = require("express");
const router   = express.Router();
const { auth, authorize } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.get("/users", auth, authorize(["Admin"]), adminController.getUsers);
router.patch("/users/:id/role", auth, authorize(["Admin"]), adminController.updateRole);
router.patch("/users/:id/deactivate", auth, authorize(["Admin"]), adminController.deActivateUser);
router.delete("/users/:id", auth, authorize(["Admin"]), adminController.deleteUser);

router.get("/records", auth, authorize(["Admin"]), adminController.getRecords);
router.post("/records", auth, authorize(["Admin"]), adminController.addRecord);
router.patch("/records/:id", auth, authorize(["Admin"]), adminController.updateRecord);
router.delete("/records/:id", auth, authorize(["Admin"]), adminController.deleteRecord);

module.exports = router;

