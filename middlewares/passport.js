const passport = require('passport');
const config = require('../config/index');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const JwtStrategy = require('passport-jwt').Strategy
    // ExtractJwt = require('passport-jwt').ExtractJwt;

// JWT Strategy

// version 1
// const opts = {}
// opts.jwtFromRequest = function(req) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['token'];
//   }
//   return token;
// };
// opts.secretOrKey = config.JWT_SECRET;

// version 2
const opts = {
  jwtFromRequest: req => req?.cookies?.token ?? null,
  secretOrKey: config.JWT_SECRET
};
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
       const user = await User.findById(jwt_payload.id); 
       if (!user) {
           return done(new Error('ไม่พบผู้ใช้ในระบบ'), null);
       }

       return done(null, user);

    } catch (error) {
        done(error);
    }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/user/auth/google/callback',
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return cb(null, existingUser);
    }

    const newUser = new User({ 
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      // Here, we're making an assumption about the returned profile object. Be sure to handle this safely.
    });

    await newUser.save();
    cb(null, newUser);

  } catch (err) {
    cb(err, null);
  }
}
));

module.exports.isLogin = passport.authenticate('jwt', { session: false });
module.exports.authenticate = passport.authenticate('google', { scope: ['profile','email'] });
