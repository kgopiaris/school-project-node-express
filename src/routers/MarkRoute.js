const express = require("express");
const Op = require("sequelize").Op;
const { User } = require("../models/Users");
const { Mark } = require("../models/Marks");
const userAuth = require("../middlewares/userAuth");

const markRouter = express.Router();

markRouter.route("/:studId").get(userAuth, (req, res) => {
  //const { email = "", id = "" } = req.user;
  Mark.findAll({
    where: {
      studId: req.params.studId
    }
  })
    .then(markObjs => {
      const marks = markObjs.map(instance => instance.get());
      res.render("student-marks", {
        layout: "hero",
        marks,
        current_user: req.user,
        title: "Mark List"
      });
    })
    .catch(console.error());

  // console.log("came to show student marks");
  // res.render("student-marks", {
  //   layout: "hero"
  // });
  //    res.send("User add form here...")
});

markRouter.route('/add/:studId').get(userAuth, (req, res) => {
  if(req.user.isStaff){
    User.findOne({
      where: {
          id: req.params.studId

      }
    }).then(studObj => {
        res.render("add-stud-marks", {
        layout: "hero",
        student: studObj,
        current_user: req.user,
        title: "Add Marks"
      });

    })
  }else {res.send("You are not allowed to add students marks");}
}).post(userAuth, (req,res) => {
  console.log("\n\n\n\n\n\n Came to insering marks....")

  const { regno = "", className = "", 
          sectionName="", examName="", 
          mathMark=0, scienceMark=0, langMark=0 } = req.body;
  const markData = {
        regNo: regno,
        class: className,
        section: sectionName,
        examName: examName,
        maths: mathMark,
        science: scienceMark,
        language: langMark,
        teacherId: req.user.id,
        studId: req.params.studId
      };
  
  Mark.create(markData)
  .then(markObj => {
    console.log("\n\n\n\n\nMarks inserted successfully!.....");
//    const redirectURL = "/marks/"+req.params.studId;
    console.log("/marks/"+req.params.studId);
//    res.send("\n\n\nSuccess!");


  res.redirect("/marks/"+req.params.studId);
  }).catch(console.error);
})

module.exports = markRouter;
