const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/permissionMiddleware");
const { getReport } = require("../controllers/reportController");

router.get("/", verifyToken, getReport);

module.exports = router;
