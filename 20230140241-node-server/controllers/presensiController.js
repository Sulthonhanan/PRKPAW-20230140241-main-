const { Presensi } = require("../models");
const { Op } = require("sequelize");

// ==========================
// CHECK-IN
// ==========================
exports.CheckIn = async (req, res) => {
  try {
    // ==== VALIDASI AUTH ====
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized - token tidak valid atau login sudah kadaluarsa"
      });
    }

    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    // ==== VALIDASI DATA ====
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Lokasi (latitude & longitude) wajib diisi"
      });
    }

    // ==== VALIDASI SATU KALI PER HARI ====
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: {
          [Op.gte]: today
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda sudah check-in hari ini"
      });
    }

    // ==== SIMPAN CHECK-IN ====
    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      checkOut: null
    });

    return res.status(201).json({
      message: "Check-in berhasil ✅",
      data: newRecord
    });

  } catch (error) {
    console.error("CHECK-IN ERROR DETAIL:", error);
    return res.status(500).json({
      message: "ERROR DETAIL",
      name: error.name,
      detail: error.message,
      errors: error.errors
    });
  }
};


// ==========================
// CHECK-OUT
// ==========================
exports.CheckOut = async (req, res) => {
  try {
    // ==== VALIDASI AUTH ====
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized - token tidak valid atau login sudah kadaluarsa"
      });
    }

    const userId = req.user.id;

    // ==== CARI DATA YANG BELUM CHECK-OUT ====
    const record = await Presensi.findOne({
      where: {
        userId,
        checkOut: null
      },
      order: [["checkIn", "DESC"]]
    });

    if (!record) {
      return res.status(400).json({
        message: "Anda belum check-in atau sudah check-out"
      });
    }

    // ==== UPDATE CHECK-OUT ====
    await record.update({
      checkOut: new Date()
    });

    return res.json({
      message: "Check-out berhasil ✅",
      data: record
    });

  } catch (error) {
    console.error("CHECK-OUT ERROR DETAIL:", error);
    return res.status(500).json({
      message: "ERROR DETAIL",
      name: error.name,
      detail: error.message,
      errors: error.errors
    });
  }
};


// ==========================
// DELETE PRESENSI
// ==========================
exports.deletePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({
        message: "Data presensi tidak ditemukan"
      });
    }

    await record.destroy();

    return res.json({
      message: "Data presensi berhasil dihapus ✅"
    });

  } catch (error) {
    console.error("DELETE ERROR DETAIL:", error);
    return res.status(500).json({
      message: "ERROR DETAIL",
      name: error.name,
      detail: error.message,
      errors: error.errors
    });
  }
};


// ==========================
// UPDATE PRESENSI
// ==========================
exports.updatePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({
        message: "Data presensi tidak ditemukan"
      });
    }

    await record.update(req.body);

    return res.json({
      message: "Presensi berhasil diperbarui ✅",
      data: record
    });

  } catch (error) {
    console.error("UPDATE ERROR DETAIL:", error);
    return res.status(500).json({
      message: "ERROR DETAIL",
      name: error.name,
      detail: error.message,
      errors: error.errors
    });
  }
};
