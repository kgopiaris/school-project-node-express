const express = require("express");
const Op = require("sequelize").Op;
const { User } = require("../models/Users");
const { compareHash } = require("../utils/hash");
const {
  userTokenGenerator,
  userTokenValidator
} = require("../utils/userTokenManager");
const userAuth = require("../middlewares/userAuth");
const userRouter = express.Router();

userRouter
  .route("/login")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const user = userTokenValidator(jwt);
    if (user) {
      res.redirect("/user");
    } else {
      res.render("login-form", {
        layout: "login"
      });
    }
  })
  .post((req, res) => {
    const { email = "", password = "" } = req.body;
    User.findOne({
      where: {
        email
      }
    })
      .then(userInstance => {
        if (userInstance) {
          const user = userInstance.get();
          const {
            id = "",
            email: emailFromDb = "", //email variable aliase as emailFromDb
            firstName = "",
            lastName = "",
            password: passwordFromDB = "",
            isStaff = "",
            isSuperUser = ""
          } = user;
          compareHash(password, passwordFromDB)
            .then(isSuccess => {
              if (isSuccess) {
                const jwtToken = userTokenGenerator({
                  id,
                  email: emailFromDb,
                  firstName,
                  lastName,
                  isStaff,
                  isSuperUser
                });
                res.cookie("jwt", jwtToken, { httpOnly: true });
                // res.status(200).send("Logged in");
                if (isSuperUser || isStaff) {
                  res.redirect("/user");
                } else {
                  res.redirect("/marks/"+id);
                }
              } else {
                res.status(400).send("No user found");
              }
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Internal Server Error");
            });
        } else {
          //          res.status(400).redirect("/")
          res.status(400).send("No user found");
        }
      })
      .catch(console.error);
  });

//viewing users....
userRouter.route("/").get(userAuth, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      console.log("\n\n\n user here...." + user.isSuperUser);
      if (user.isSuperUser) {
        User.findAll({
          where: {
            isSuperUser: { [Op.ne]: true }
            //reporterId: user.id
            //isStaff: false
          }
          //    attributes: { exclude: ['password']
        })
          .then(userObjs => {
            //console.log("\n\n\n\n\n\n came to here.......\n req.user: "+ req.user);
            const users = userObjs.map(instance => instance.get());
            res.render("users-listing", {
              layout: "hero",
              users,
              current_user: req.user,
              title: "Users Lising"
            });
          })
          .catch(console.error());
      } else if (user.isStaff) {
        User.findAll({
          where: {
            isSuperUser: { [Op.ne]: true },
            isStaff: false,
            reporterId: user.id
            //isStaff: false
          }
          //    attributes: { exclude: ['password']
        })
          .then(userObjs => {
            //console.log("\n\n\n\n\n\n came to here.......\n req.user: "+ req.user);
            const users = userObjs.map(instance => instance.get());
            res.render("users-listing", {
              layout: "hero",
              users,
              current_user: req.user,
              title: "Users List"
            });
          })
          .catch(console.error());
      } else {
          res.send("You are not allowed to view all users!")
      }
    })
    .catch(console.error());
});

// adding users...
userRouter.route("/adduser").get(userAuth, (req, res) => {
  console.log("came to show add user form");
  res.render("add-user-form", {
    layout: "hero-profile",
    current_user: req.user
  });
  //    res.send("User add form here...")
}).post(userAuth, (req,res) => {
  console.log("\n\n\n\n\n\n Came to add user....")
  const { fname = "", lname = "", 
          email="",  password="123456",
          teacher="" } = req.body;
  User.findOne({
    where: {
        id: teacher
    }
  }).then(teacherObj => {
      const userData = {
        firstName: fname,
        lastName: lname,
        email: email,
        password: password,
        reporterId: teacherObj.id
      };
      
      User.create(userData)
      .then(userData => {
        console.log("\n\n\n\n\n User added successfully!.....");
        res.redirect("/user");
      }).catch(console.error);

  });
});

// Viewing profile page....
userRouter.route("/profile").get(userAuth, (req, res) => {
  //res.send(req.user.firstName + "'s profile");
  const { email = "", id = "" } = req.user;
  User.findOne({
    where: {
      email,
      id
    }
  })
    .then(current_user => {
      res.render("profile", {
        layout: "hero-profile",
        current_user,
        title: "User Profile"
      });
    })
    .catch(console.error());
});

// Logout....
userRouter.route("/logout").get(userAuth, (req, res) => {
  console.log("hello....");
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = userRouter;
