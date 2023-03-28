import express from "express";
import cookieParser from "cookie-parser";
import { config as dotEnvConfig } from "dotenv";
import passport from "./security/passportStrategy";
import bodyParser from "body-parser";
import userAuthRouter from "./security/userAuthRouter";
import { generatedRest } from "./biz/generated/generatedRest";
import config from "config";
import cors from "cors";

// import passport from 'passport';
dotEnvConfig();

// 1 expressの設定
const app = express();
// 2 passportを初期化
app.use(passport.initialize());

// 	CORSの設定、本番時には、originを変更する
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    preflightContinue: true,
  })
);

const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("../client/dist/"));

// 3 routerを追加
app.use(userAuthRouter);

// app.use( passport.authenticate("jwt", { session: false }), generatedRest );
app.use(generatedRest);

app.listen(config.get("server_port"), () => {
  console.log(config);
  console.log("listen to " + config.get("server_port"));
});
