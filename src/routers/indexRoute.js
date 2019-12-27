const express = require("express");
const { Post } = require("../models/Posts");
const { Author } = require("../models/Authors");
const { userTokenValidator } = require("../utils/userTokenManager");

//const { Author } = require("../models/Authors");
//const userAuth = require("../middlewares/userAuth");
const indexRouter = express.Router();

indexRouter.route("/").get((req, res) => {
  const { jwt = "" } = req.cookies;
  if (jwt) {
    const user = userTokenValidator(jwt);
    if (user) {
      req.user = user;
    }
  }
  //const current_user = req.user ? req.user : false;
  const view_btn = user => {
    if (req.user) {
      if (req.user.isSupperUser || req.user.isStaff) {
        console.log("\n\n\n Super user...");
        return `<a class="btn btn-outline-primary" href="/user" role="button">View users</a>`;
      } else {
        return `  <a class="btn btn-outline-primary" href="/mark/${
          req.user.id
        }" role="button">View marks</a>`;
      }
    } else {
      return `   
             <p>You can try logging in manage your subordinates</p>
             <a class="btn btn-outline-primary" href="/user/login" role="button">Sign in</a>  `;
    }
  };

  // console.log(
  //   "\n\n\n\n indexRouter, current_user: " +
  //     req.user.id +
  //     " view_btn: " +
  //     view_btn()
  // );
  Post.findAll({
    include: [{ model: Author, as: "Writer" }]
  })
    .then(postsInstance => {
      const posts = postsInstance.map(instance => instance.get());
      res.render("home", {
        layout: "hero",
        posts,
        view_btn_str: view_btn(),
        current_user: req.user,
        title: "Blog Home"
      });
    })
    .catch(console.error);
});

module.exports = indexRouter;
