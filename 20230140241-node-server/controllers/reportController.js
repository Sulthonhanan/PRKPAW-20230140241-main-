const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"]
        }
      ],
      where: {}
    };

    // ===========================
    // FILTER NAMA (dari tabel Users)
    // ===========================
    if (nama) {
      options.include[0].where = {
        nama: {
          [Op.like]: `%${nama}%`
        }
      };
    }

    // ===========================
    // FILTER RENTANG TANGGAL
    // ===========================
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)]
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filter: { nama, tanggalMulai, tanggalSelesai },
      total: records.length,
      data: records,
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message
    });
  }
};
