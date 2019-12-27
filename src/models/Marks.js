const Sequelize = require("sequelize");
const BlogDB = require("../config/BlogDB");
const { User } = require("./Users");
const fs = require("fs");
const path = require("path");

const Mark = BlogDB.define("mark", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  regNo: Sequelize.STRING,
  class: Sequelize.STRING,
  section: Sequelize.STRING,
  examName: Sequelize.STRING,
  maths: Sequelize.INTEGER,
  science: Sequelize.INTEGER,
  language: Sequelize.INTEGER
});

Mark.belongsTo(User, { foreignKey: "teacherId", as: "Teacher" });
Mark.belongsTo(User, { foreignKey: "studId", as: "Student" });

const MarkSync = ({ force = false, user = {} } = { force: false }) => {
  Mark.sync({ force })
    .then(() => {
      fs.readFile(
        path.join(__dirname, "../../initMarkData.json"),
        "utf-8",
        (err, data) => {
          if (!err) {
            const markData = JSON.parse(data);
            markData.forEach(mark => {
              Mark.create(mark)
                .then(result => {
                  console.log(result.get());
                })
                .catch(console.error);
            });
            console.log("data inserted successfully!....");
          } else {
            console.log(err);
          }
        }
      );
    })
    .catch(console.error);
};

exports.Mark = Mark;
exports.MarkSync = MarkSync;
