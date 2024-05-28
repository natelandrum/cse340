// Imports
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const session = require("express-session");
const pool = require("./database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// App Initialization
const app = express();

// Route and Utility Imports
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");

// Session Configuration
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

// Flash Messages Configuration
app.use(require("connect-flash")()).use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Body Parser Configuration
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser Configuration
app.use(cookieParser());

// JWT Configuration
app.use(utilities.checkJWTToken);

// View Engine Configuration
app
  .set("view engine", "ejs")
  .use(expressLayouts)
  .set("layout", "./layouts/layout");

// Routes Configuration
app
  .use(static)
  .get("/", utilities.handleErrors(baseController.buildHome))
  .use("/inv", utilities.handleErrors(inventoryRoute))
  .use("/account", utilities.handleErrors(require("./routes/accountRoute")))


// Error Handling
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
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

// Server Configuration
const port = process.env.PORT;
const host = process.env.HOST;

// Server Start
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
