import express from "express";
import passport from "./passportStrategy"
const userAuthRouter = express.Router();

import {config as dotEnvConfig} from 'dotenv';
import login from './login';
import jwt from 'jsonwebtoken';
dotEnvConfig();

userAuthRouter.post(
  '/login',
  login,
  async (req, res) => {
      let user

      if (res.locals.user) {
          user = res.locals.user
      } else {
          res.status(400).json({
              error: 'user not found'
          })
      }

      const payload = {
          username: user.username,
          expiration: Date.now() + parseInt("60000")
      }

      const token = jwt.sign(JSON.stringify(payload), "levelenter!!")

      res
      .cookie('jwt',
          token, {
              httpOnly: true,
              secure: false //--> SET TO TRUE ON PRODUCTION
          }
      )
      .status(200)
      .json({
          message: 'You have logged in :D'
      })
  }
)

// userAuthRouter.post("/login",passport.authenticate("local",{session:false}),async (req, res, next) => {
//   // 1 jwtのtokenを作成
//   console.log("local",req.body);

//   if(req.body){
//     const user = req.user as any;
//     const userAuth = new AuthService();
//     // const result  = await userAuth.login(user.mail ,user.password )
//     const result = {data:{}} as any;
//     if(result){
//       // const userInDB:AuthUser = result.data;
//       // const token = userAuth.createJwtToken(userInDB.user_name, userInDB.user_id)
//       // res.json({ user, token });  
//       res.json({ message : "ok"})
//     }else{
//       res.json({ message : "no message"})
//     }
//   }else{
//     res.json({ message : "no body"})
//   }

//   // res.json({ login:"ok"})
// }
// );

userAuthRouter.get("/test", async(req, res, next)=>{
  console.log("test")
  res.json({ ok :"ok" });
})

userAuthRouter.post("/test_auth", passport.authenticate('jwt', { session: false }),async(req, res, next)=>{
  console.log("test")
  res.json({ ok :"ok" });
})


export default userAuthRouter;