require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Mount all API routes from server/api/
app.use("/api", require("./api/index.js"));
app.use("/auth", require("./api/auth"));
app.use("/api/weeks", require("./api/weeks"));

// Root ping (optional)
app.get("/", (req, res) => {
  res.send("Server is up.");
});

// Error handler so hangs become visible errors
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✨ Server listening on http://localhost:${PORT}`);
});
