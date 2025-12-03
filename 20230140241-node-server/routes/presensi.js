const express = require("express");
const router = express.Router();

const { 
  CheckIn, 
  CheckOut, 
  deletePresensi, 
  updatePresensi 
} = require("../controllers/presensiController");

const { addUserData } = require("../middleware/permissionMiddleware");

router.use(addUserData);

router.post("/check-in", CheckIn);
router.post("/check-out", CheckOut);
router.delete("/:id", deletePresensi);
router.put("/:id", updatePresensi);

module.exports = router;
