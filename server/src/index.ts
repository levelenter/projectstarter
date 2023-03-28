import express from "express";
import cookieParser from "cookie-parser";
import { config as dotEnvConfig } from "dotenv";
import passport from "./security/passportStrategy";
import bodyParser from "body-parser";
import userAuthRouter from "./security/userAuthRouter";
import { generatedRest } from "./biz/generated/generatedRest";
import { allowCrossDomainRouter } from "./security/allowCrossDomainRouter";
import config from "config";
// import cors from "express-cors";
import cors from "cors";

// import passport from 'passport';
dotEnvConfig();

// 1 expressの設定
const app = express();
// 2 passportを初期化
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    preflightContinue: true,
    // optionsSuccessStatus: 200, //レスポンスstatusを200に設定
    methods: "GET, POST, PATCH, DELETE, PUT, OPTIONS",
    allowedHeaders:
      "Content-Type, Authorization, Accept, X-Requested-With, Origin, X-XSRF-TOKEN",
  })
);
// app.use(
//   cors({
//     allowedOrigins: ["http://localhost:3000"],
//     allowCredentials: true,
//   })
// );
//    origin: "http://localhost:3000",
// credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加

const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("../client/dist/"));
// app.use(allowCrossDomainRouter);

// 3 routerを追加
app.use(userAuthRouter);

// app.use( passport.authenticate("jwt", { session: false }), generatedRest );
app.use(generatedRest);

app.listen(config.get("server_port"), () => {
  console.log(config);
  console.log("listen to " + config.get("server_port"));
});
