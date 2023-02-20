import passport  from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt
} from "passport-jwt";
// import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth'

import {config as dotEnvConfig} from 'dotenv';
dotEnvConfig();

// 1 passport-localの設定
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },
    (username: string, password: string, done: any) => {
      if (username === "hoge" && password === "fuga") {
        return done(null, username);
      } else {
        return done(null, false, {
          message: "usernameまたはpasswordが違います",
        });
      }
    }
  )
);

// 2 passport-jwtの設定
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:  process.env.JWT_SECRET,
};
passport.use(new JWTStrategy(opts, (jwt_payload: any, done: any) => {
    done(null, jwt_payload);
}));

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