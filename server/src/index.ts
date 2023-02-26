import express from "express";
import cookieParser from "cookie-parser";
import {config as dotEnvConfig} from 'dotenv';
import passport from "./security/passportStrategy";
import bodyParser from "body-parser";
import userAuthRouter from "./security/userAuthRouter";
import {generatedRest} from "./biz/generated/generatedRest"
import { allowCrossDomainRouter } from './security/allowCrossDomainRouter';
import config from 'config';
dotEnvConfig(); 

// 1 expressの設定
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("../client/dist/"))
app.use(allowCrossDomainRouter)

// 2 passportを初期化
app.use(passport.initialize());

// 3 routerを追加
app.use( userAuthRouter );

// app.use( passport.authenticate("jwt", { session: false }), generatedRest );
app.use(  generatedRest );

app.listen(config.get("server_port"), () => {
  console.log(config);
  console.log("listen to " + config.get("server_port"));
});