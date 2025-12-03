const { Presensi } = require("../models");
const { Op } = require("sequelize");

// ==========================
// CHECK-IN
// ==========================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { latitude, longitude } = req.body;

    // Cek sudah check-in atau belum
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await Presensi.findOne({
      where: {
        userId,
        checkIn: { [Op.gte]: startOfDay }
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda sudah check-in hari ini"
      });
    }

    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude,
    });

    return res.json({
      message: "Check-in berhasil",
      data: newRecord
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message
    });
  }
};

// ==========================
// CHECK-OUT
// ==========================
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const record = await Presensi.findOne({
      where: {
        userId,
        checkOut: null
      }
    });

    if (!record) {
      return res.status(400).json({
        message: "Anda belum check-in"
      });
    }

    await record.update({
      checkOut: new Date()
    });

    return res.json({
      message: "Check-out berhasil",
      data: record
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message
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
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await record.destroy();

    return res.json({ message: "Presensi berhasil dihapus" });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message
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
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    await record.update(req.body);

    return res.json({
      message: "Presensi berhasil diupdate",
      data: record
    });

  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message
    });
  }
};
