const express = require("express");
const router = express.Router();
const passport = require("passport");

//@desc Auth with google
//@req GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@desc Google callback
//@req GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("attempt?");
    res.redirect("/getGames");
  }
);

//@desc Logout User
//@req GET /logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
