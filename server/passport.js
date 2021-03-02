const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");

const User = require("./models/user");

passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        const existingUser = await User.findOne({ facebookId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          facebookId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
