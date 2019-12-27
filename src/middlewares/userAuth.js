const { userTokenValidator } = require("../utils/userTokenManager");

const userAuth = (req, res, next) => {
  const { jwt = "" } = req.cookies;
  const user = userTokenValidator(jwt);
  if (user) {
    req.user = user;
    //res.redirect("/user");
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = userAuth;
