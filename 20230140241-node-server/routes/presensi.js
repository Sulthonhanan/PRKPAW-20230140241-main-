const express = require("express");
const router = express.Router();

const { CheckIn, CheckOut, deletePresensi, updatePresensi } = require("../controllers/presensiController");
const { verifyToken } = require("../middleware/permissionMiddleware");

router.post("/check-in", verifyToken, CheckIn);
router.post("/check-out", verifyToken, CheckOut);
router.delete("/:id", verifyToken, deletePresensi);
router.put("/:id", verifyToken, updatePresensi);

module.exports = router;
