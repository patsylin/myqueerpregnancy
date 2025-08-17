const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const apiRouter = require("./api");            // <-- CJS
const rightsRouter = require("./routes/rights"); // if you use this

const app = express();

// … your middleware …
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(cors());

// static
app.use(express.static(path.join(__dirname, "..", "client/dist/")));

// mount api
app.use("/api", apiRouter);
app.use("/api/rights", rightsRouter); // keep only once

// … error handler, listen, etc.
module.exports = app;
