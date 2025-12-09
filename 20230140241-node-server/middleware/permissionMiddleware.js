const jwt = require("jsonwebtoken");

const JWT_SECRET = "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ada atau format salah" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("JWT Token Verified:", decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
  }
};
