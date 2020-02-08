const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./key')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrToken;
const User_col = require('../app/models/user')
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log(jwt_payload)
      // User_col.findOne({ id: jwt_payload.sub }, function (err, user) {
      //   if (err) {
      //     return done(err, false);
      //   }
      //   if (user) {
      //     return done(null, user);
      //   } else {
      //     return done(null, false);
      //     // or you could create a new account
      //   }
      // });
    })
  );
}