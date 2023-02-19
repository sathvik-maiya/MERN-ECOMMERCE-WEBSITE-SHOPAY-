const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileupload = require("express-fileupload");
const errormiddleware = require("./middleware/error");
// const path = require("path");

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieparser());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(fileupload({ limit: "50mb" }));

//route imports
const product = require("./routes/productroute");
const user = require("./routes/userroute");
const order = require("./routes/orderroute");
const payment = require("./routes/paymentRoute");
const { request } = require("express");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });
// middleware for error
app.use(errormiddleware);

module.exports = app;
