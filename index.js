const express = require("express");
const app = express();

const port = 8080;
const ejs = require("ejs");
const path = require("path");
const flash = require("connect-flash");
const AppError = require("./ErrorHandle/AppError");
const User = require("./users/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(cookieParser(process.env.SECRET_KEY));
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY, // used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: { maxAge: 60000 }, // session cookie lifetime (ms)
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.message = req.flash("message");
  next();
});

app.get("/", (req, res) => {
  console.log("this is home");

  res.render("home.ejs", { req });
});
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.post("/signup", async (req, res, next) => {
  let { username, email, password } = req.body;
  const user = await User.register(
    new User({ username: username, email: email }),
    password
  );
  req.login(user, (err) => {
    if (err) {
      console.log(err.message);
    }
    req.session.user = req.user.id;
    res.send("logged in");
  });
});

app.get("/login", (req, res, next) => {
  res.render("login.ejs");
});
app.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(`internal error occure during login ${err}`);
      return next(new AppError(`internal error occure during login ${err}`));
    }
    if (!user) {
      console.log(`Login failed ${info.message}`);

      req.flash("error", info.message);

      return res.redirect("/login");
      // return next(new AppError(`login failed ${info.message}`, 401));
    }

    //login
    req.login(user, (err) => {
      if (err) {
        console.log("Login error after authentication:", err);

        return next(new AppError("Login failed during session creation.", 500));
      }
      req.session.user = req.user.id; // store user id in session if you like
      req.flash("success", "logged in");
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", async (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "logged out");

        res.redirect("/");
      }
    });
  } else {
    return next(new AppError("you are not logged in"));
  }
});

app.get("/profile", (req, res) => {
  console.log(req.user);

  res.send(`${req.session.user}`);
});

app.use((req, res, next) => {
  res.status(404).send("Page not found");
  next();
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(port, () => {
  console.log(`server is connected to the ${port} port`);
});
