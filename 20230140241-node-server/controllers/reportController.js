const { Presensi, User } = require("../models");

exports.getReport = async (req, res) => {
  try {
    const data = await Presensi.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "email", "role"]
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
