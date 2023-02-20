import express from "express";
import jwt from "jsonwebtoken";
import passport from "./configuredPasspor"
const userAuthRouter = express.Router();

import {config as dotEnvConfig} from 'dotenv';
dotEnvConfig();


userAuthRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    // 1 jwtのtokenを作成
    const user = req.user;
    const payload = { user: req.user };
    const token = jwt.sign(payload, process.env.JWT_SECRET  as string, {
      expiresIn: "1m",
    });
    res.json({ user, token });
  }
);

export default userAuthRouter;