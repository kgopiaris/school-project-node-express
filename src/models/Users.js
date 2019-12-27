const Sequelize = require("sequelize");
const BlogDB = require("../config/BlogDB");
const { generateHashSync } = require("../utils/hash");
const fs = require("fs");
const path = require("path");

const User = BlogDB.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    isSuperUser: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    isStaff: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: Sequelize.STRING
  },
  {
    setterMethods: {
      password(plainTextPassword) {
        this.setDataValue("password", generateHashSync(plainTextPassword));
      }
    },
    getterMethods: {
      fullName() {
        return (
          this.getDataValue("firstName") + " " + this.getDataValue("lastName")
        );
      }
    }
  }
);

User.hasMany(User, { foreignKey: "reporterId", as: "Reporter" });
const UserSync = ({ force = false } = { force: false }) => {
  User.sync({ force })
    .then(() => {
      fs.readFile(
        path.join(__dirname, "../../initUserData.json"),
        "utf-8",
        (err, data) => {
          if (!err) {
            const userData = JSON.parse(data);
            userData.forEach(user => {
              User.create(user)
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

exports.User = User;
exports.UserSync = UserSync;
