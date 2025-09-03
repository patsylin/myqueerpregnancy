// server/index.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser()); // <-- UNSIGNED cookies

app.use("/api", require("./api/index.js"));

app.get("/", (_req, res) => res.send("Server is up."));

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✨ Server listening on http://localhost:${PORT}`);
});
