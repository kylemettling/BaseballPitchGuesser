const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const connectDB = require("./config/database");
const homeRoutes = require("./routes/home");
const gameListRoutes = require("./routes/gamesList");
const gamePageRoutes = require("./routes/gamePage");
const authRoutes = require("./routes/auth");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const fetch = require("node-fetch");
const { ensureAuth, ensureGuest } = require("./middleware/auth");
const methodOverride = require("method-override");

const PORT = 5000;
// Set date and month
let today = new Date();
const { month, day } = { day: today.getDate(), month: today.getMonth() + 1 };
require("dotenv").config({ path: `${__dirname}/config/process.env` });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const API_KEY = process.env.API_KEY;
// getDummyGameLinks(dummyData);

// Load passport config
require("./config/passport")(passport);

connectDB();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// initialize passport sessions - persists auth until user logs out
app.use(passport.initialize());
app.use(passport.session());

// @route Homepage
app.use("/", homeRoutes);
// @route Game Schedule page
app.use("/auth", authRoutes);
app.use("/getGames", gameListRoutes);

app.use("/game", gamePageRoutes);
// app.post("/game/:matchupId", gamePageRoutes);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
