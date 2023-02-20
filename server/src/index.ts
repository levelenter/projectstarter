import express from "express";
import cookieParser from "cookie-parser";
import {config as dotEnvConfig} from 'dotenv';
import passport from "./security/configuredPasspor";
import bodyParser from "body-parser";
import userAuthRouter from "./security/userAuthRouter";
import {generatedRest} from "./biz/generated/generatedRest"
dotEnvConfig();

// 1 expressの設定
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("../client/dist/"))

// 2 passportを初期化
app.use(passport.initialize());

// 3 routerを追加
app.use( userAuthRouter);

app.use( passport.authenticate("jwt", { session: false }), generatedRest)

app.listen(3000, () => {
  console.log("listen to " + 3000);
});