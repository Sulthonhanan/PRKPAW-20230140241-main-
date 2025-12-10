const { Presensi } = require("../models");
const { Op } = require("sequelize");

// ==========================
// CHECK-IN
// ==========================
exports.CheckIn = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized - token tidak valid"
      });
    }

    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Lokasi wajib diisi"
      });
    }

    // Validasi 1x per hari
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: { [Op.gte]: today }
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda sudah check-in hari ini"
      });
    }

    // Foto dari multer
    const buktiFoto = req.file ? req.file.filename : null;

    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      buktiFoto: buktiFoto,
      checkOut: null
    });

    return res.status(201).json({
      message: "Check-in berhasil",
      data: newRecord
    });

  } catch (error) {
    console.error("CHECK-IN ERROR DETAIL:", error);
    return res.status(500).json({
      message: "ERROR",
      detail: error.message
    });
  }
};

// ==========================
// CHECK-OUT
// ==========================
exports.CheckOut = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
      order: [["checkIn", "DESC"]]
    });

    if (!record) {
      return res.status(400).json({
        message: "Belum check-in atau sudah check-out"
      });
    }

    await record.update({ checkOut: new Date() });

    return res.json({
      message: "Check-out berhasil",
      data: record
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// DELETE
// ==========================
exports.deletePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await record.destroy();
    return res.json({ message: "Data berhasil dihapus" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// UPDATE
// ==========================
exports.updatePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Presensi.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await record.update(req.body);

    return res.json({
      message: "Data berhasil diperbarui",
      data: record
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
