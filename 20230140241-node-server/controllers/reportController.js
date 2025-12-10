const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let where = {};

    // Filter tanggal
    if (tanggalMulai && tanggalSelesai) {
      where.createdAt = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)]
      };
    } else if (tanggalMulai) {
      where.createdAt = { [Op.gte]: new Date(tanggalMulai) };
    } else if (tanggalSelesai) {
      where.createdAt = { [Op.lte]: new Date(tanggalSelesai) };
    }

    // Query DB
    const data = await Presensi.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email", "role"],
          where: nama
            ? { nama: { [Op.like]: `%${nama}%` } }
            : undefined
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      message: "Data report berhasil diambil",
      data
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data report",
      error: error.message
    });
  }
};
