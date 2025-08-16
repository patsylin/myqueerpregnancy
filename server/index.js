// server/index.js (ESM)
import express from "express";
import cors from "cors";
import morgan from "morgan";

// ✅ use your JSON-backed route
import sizesRouter from "./routes/sizes-memory.js";

// (optional) other routers
// import usersRouter from "./routes/users.js";
// import journalRouter from "./routes/journal.js";
// import rightsRouter from "./routes/rights.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check
app.get("/ping", (_req, res) => res.send("pong"));

// mount routes
app.use("/api/sizes", sizesRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/journal", journalRouter);
// app.use("/api/rights", rightsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// import express from "express";
// import sizesRouter from "./routes/sizes-memory.js";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/sizes", sizesRouter);

// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./.env" });
// const PORT = process.env.PORT || 8080;
// const path = require("path");
// const rightsRouter = require("./routes/rights");

// // init morgan
// const morgan = require("morgan");
// app.use(morgan("dev"));
// app.use(cookieParser(process.env.COOKIE_SECRET));

// // init body-parser
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

// // init cors
// const cors = require("cors");
// app.use(cors());

// const client = require("./db/client");
// client.connect();

// app.use(express.static(path.join(__dirname, "..", "client/dist/")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
// });

// // Router: /api
// app.use("/api", require("./api"));

// app.use((error, req, res, next) => {
//   res
//     .status(error.status || 500)
//     .send(error.message || "internal server error");
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// app.use("/api/rights", rightsRouter);

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
