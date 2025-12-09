const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// Routes
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Register route paths
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () =>
  console.log(`Server berjalan di: http://localhost:${PORT}`)
);
