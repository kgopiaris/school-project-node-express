const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const indexRouter = require("./routers/indexRoute");
const userRouter = require("./routers/userRoute");
const markRouter = require("./routers/MarkRoute");
const expressHbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

const app = express();

const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials")
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());

app.use("/", indexRouter);
app.use("(/user(s)?)?", userRouter);
app.use("(/user(s)?)?(/profile)?", userRouter);
app.use("/mark(s)?", markRouter);

const server = app.listen(process.env.PORT, () => {
  console.log("Server running in port - ", server.address().port);
});
