const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");

const passportInitializer = (passport, getbymail, getbyid) => {
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await getbymail(email);

        if (!user)
          return done(null, false, { message: "no user with that email" });
        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect Password" });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    return done(null, await getbyid(id));
  });
};
module.exports = passportInitializer;
