const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const session = require("express-session");
const pool = require("./database");
const bodyParser = require("body-parser");

const app = express();

const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  }),
);

app.use(require("connect-flash")()).use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

app
  .set("view engine", "ejs")
  .use(expressLayouts)
  .set("layout", "./layouts/layout");

app
  .use(static)
  .get("/", utilities.handleErrors(baseController.buildHome))
  .use("/inv", utilities.handleErrors(inventoryRoute))
  .use("/account", utilities.handleErrors(require("./routes/accountRoute")))
  .use(async (req, res, next) => {
    next({ status: 404, message: "Sorry, we appear to have lost that page." });
  });

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(
    `Error at: "${req.originalUrl}": ${err.message}`,
  );
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    description: err.message || "Error Page",
  });
});

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
