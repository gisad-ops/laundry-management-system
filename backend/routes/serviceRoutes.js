const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getServices, createService, updateService, deleteService,
} = require("../controllers/serviceController");

router.get("/", getServices); // public
router.use(protect);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;