const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { verifyToken } = require("../middleware/permissionMiddleware");

// CHECK-IN dengan upload foto
router.post(
  "/check-in",
  verifyToken,
  presensiController.upload.single("image"),
  presensiController.CheckIn
);

// CHECK-OUT
router.post("/check-out", verifyToken, presensiController.CheckOut);

// DELETE PRESENSI
router.delete("/:id", verifyToken, presensiController.deletePresensi);

// UPDATE PRESENSI
router.put("/:id", verifyToken, presensiController.updatePresensi);

module.exports = router;
