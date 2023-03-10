import passport  from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
// import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth'
const secret = "levelenter!!"

const cookieExtractor = req => {
  let jwt = null 
  if (req && req.cookies) {
      jwt = req.cookies['jwt']
  }
  return jwt
}

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret
}, (jwtPayload, done) => {
  const { expiration } = jwtPayload
  if (Date.now() > expiration) {
    done('Unauthorized', false)
  }
  done(null, jwtPayload)
}))

// https://console.cloud.google.com/apis/credentials?project=block-vrock-1532736157223
// passport.use(new GoogleStrategy({
//         clientID: "クライアントID",
//         clientSecret: "クライアントシークレット",
//         callbackURL: "上記で設定したロールバック URL"
//     }, function(accessToken, refreshToken, profile, done){
//       // ここで profile を確認して結果を返す
//       if (profile) {
//         return done(null, profile);
//       } else {
//         return done(null, false);
//       }
//     }
// ));

// 3 passportをexport
export default passport;