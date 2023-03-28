import express from "express";
import { errorHandler } from "./web_handler";
import { tokenHandler } from "./tokenHandler";
import type { Assessment } from "../../dto/Assessment";
import { AssessmentService } from "../AssessmentService";
import { AuthService } from "../AuthService";
import { ConfigService } from "../ConfigService";
import { GptChatService } from "../GptChatService";

export const generatedRest = express.Router();
import passport from "passport";

generatedRest.post(
  "/v1/AssessmentService/save",
  passport.authenticate("jwt", { session: false }),
  async (req: express.Request, res: express.Response) => {
    const biz = new AssessmentService();
    try {
      tokenHandler(req, true, ["value"]);
      const result = await biz.save(req.body[0] as Assessment);

      console.log(req.body);
      res
        .cookie("jwt", "token", {
          httpOnly: true,
          secure: false, //--> SET TO TRUE ON PRODUCTION
        })
        .status(200)
        .send(result);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);

generatedRest.get(
  "/v1/AuthService/getLoginUserInfo",
  passport.authenticate("jwt", { session: false }),
  async (req: express.Request, res: express.Response) => {
    const biz = new AuthService();
    try {
      tokenHandler(req, true, ["mail"]);
      const result = await biz.getLoginUserInfo(req.query[0] as string);
      res.send(result);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);

generatedRest.post(
  "/v1/AuthService/forceLogin",
  passport.authenticate("jwt", { session: false }),
  async (req: express.Request, res: express.Response) => {
    const biz = new AuthService();
    try {
      tokenHandler(req, true, ["mail"]);
      const result = await biz.forceLogin(req.body[0] as string);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);

generatedRest.get(
  "/v1/AuthService/login",
  async (req: express.Request, res: express.Response) => {
    const biz = new AuthService();
    console.log("loginstarrt");
    try {
      tokenHandler(req, false, ["mail", "password"]);
      const result = await biz.login(
        req.query[0] as string,
        req.query[1] as string
      );
      res
        .cookie("jwt", req.query.token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .send(result);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);

generatedRest.post(
  "/v1/AuthService/createUserApi",
  async (req: express.Request, res: express.Response) => {
    const biz = new AuthService();
    try {
      tokenHandler(req, false, [
        "mail",
        "password",
        "create_name",
        "auth_tags",
      ]);
      const result = await biz.createUserApi(
        req.body[0] as string,
        req.body[1] as string,
        req.body[2] as string,
        req.body[3] as string
      );
      res.send(result);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);

generatedRest.get(
  "/v1/ConfigService/get",
  passport.authenticate("jwt", { session: false }),
  async (req: express.Request, res: express.Response) => {
    const biz = new ConfigService();
    try {
      tokenHandler(req, true, []);
      const result = await biz.get();
      res.send(result);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);

generatedRest.post(
  "/v1/GptChatService/sendMessage",
  async (req: express.Request, res: express.Response) => {
    const biz = new GptChatService();
    try {
      tokenHandler(req, false, ["message"]);
      const result = await biz.sendMessage(req.body[0] as string);
      res.send(result);
    } catch (error) {
      errorHandler(res, error as any);
    }
  }
);
