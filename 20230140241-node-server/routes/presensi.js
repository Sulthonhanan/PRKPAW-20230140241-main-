const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const presensiController = require("../controllers/presensiController");
const { verifyToken } = require("../middleware/permissionMiddleware");

// CHECK-IN + upload foto
router.post(
  "/check-in",
  verifyToken,
  upload.single("image"),       // PAKAI uploadMiddleware
  presensiController.CheckIn
);

// CHECK-OUT
router.post("/check-out", verifyToken, presensiController.CheckOut);

// DELETE
router.delete("/:id", verifyToken, presensiController.deletePresensi);

// UPDATE
router.put("/:id", verifyToken, presensiController.updatePresensi);

module.exports = router;
