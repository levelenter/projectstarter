import express from "express";
import passport from "passport";
const userAuthRouter = express.Router();

import {config as dotEnvConfig} from 'dotenv';
import { AuthService } from "../biz/AuthService";
import { AuthUser } from '../dto/AuthUser';
dotEnvConfig();

const login = async (req, res, next) => {
    try {
      const { mail, password } = req.body
      let user = { mail, password }
  
      const authService = new AuthService();
      const loginResult = await authService.login(user.mail,user.password)
      res.locals.user = loginResult.data
      next()
    } catch (error) {
        res.status(400).json({error: 'Incorrect username or password'});
        // res.status(500).json({ error })
    }
  }

userAuthRouter.post('/login',login,async (req, res) => {
    let user:AuthUser
    if (res.locals.user) {
        user = res.locals.user
    } else {
        res.status(400).json({error: 'user not found'})
        return;
    }

    const authService = new AuthService();
    const token = authService.createJwtToken(user.user_name,user.user_id);
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false //--> SET TO TRUE ON PRODUCTION
    })
    .status(200)
    .json({
        message: 'logged in!'
    })
})

userAuthRouter.get("/test", async(req, res, next)=>{
  console.log("test")
  res.json({ ok :"ok" });
})

userAuthRouter.post("/test_auth", passport.authenticate('jwt', { session: false }),async(req, res, next)=>{
  console.log("test")
  res.json({ ok :"ok" });
})


export default userAuthRouter;