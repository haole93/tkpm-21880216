"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const expressHandlebars = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");
const { createStarList } = require("./controllers/handlebarsHelper");
const session = require("express-session");
const passport = require("./controllers/passport");
const flash = require("connect-flash");


//public static folder
app.use(express.static(__dirname + "/public"));

//handlebars
app.engine(
  "hbs",
  expressHandlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: { allowProtoPropertiesByDefault: true },
    helpers: { createPagination, createStarList },
  })
);
app.set("view engine", "hbs");

//parsing input
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 //20 mins
    },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//middleware
app.use((req, res, next) => {
  let Cart = require("./controllers/cart");
  req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
  res.locals.quantity = req.session.cart.quantity;
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productsRouter"));
app.use("/users", require("./routes/authRouter"));
app.use('/admin', require('./routes/adminRouter'));
app.use("/users", require("./routes/usersRouter"));


//error handlers
app.use((req, res, next) => {
  res.status(404).render("error", { message: "File not found!" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error", { message: "Internal Server Error!" });
});

//server starting
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
