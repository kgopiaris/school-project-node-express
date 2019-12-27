const express = require("express");

const authorRouter = express.Router();

authorRouter
  .route("/login")
  .get((req, res) => {
    res.render("login-form", {
      layout: "login"
    });
  })
  .post((req, res) => {
    console.log(req.body);
    res.send("processing...");
  });

module.exports = authorRouter;
