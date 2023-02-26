import express from 'express';
import { errorHandler } from './web_handler';
import { tokenHandler } from './tokenHandler';
import { AuthService } from '../AuthService';
import { ConfigService } from '../ConfigService';


export const generatedRest = express.Router();
import passport  from "passport";

generatedRest.get('/v1/AuthService/getLoginUserInfo',
passport.authenticate("jwt", { session: false }) ,
async (req: express.Request, res: express.Response) => {
  const biz = new AuthService();
  try{
    tokenHandler(req, true, ["mail"] );
    const result = await biz.getLoginUserInfo(req.query[0] as string);
    res.send(result);
  } catch(error) {
    errorHandler(res, error as any);
  }
});

generatedRest.post('/v1/AuthService/forceLogin',
passport.authenticate("jwt", { session: false }) ,
async (req: express.Request, res: express.Response) => {
  const biz = new AuthService();
  try{
    tokenHandler(req, true, ["mail"] );
    const result = await biz.forceLogin(req.body[0] as string);
    res.send(result);
  } catch(error) {
    errorHandler(res, error as any);
  }
});

generatedRest.get('/v1/AuthService/login',
async (req: express.Request, res: express.Response) => {
  const biz = new AuthService();
  try{
    tokenHandler(req, false, ["mail","password"] );
    const result = await biz.login(req.query[0] as string,req.query[1] as string);
    res.send(result);
  } catch(error) {
    errorHandler(res, error as any);
  }
});

generatedRest.post('/v1/AuthService/createUserApi',
async (req: express.Request, res: express.Response) => {
  const biz = new AuthService();
  try{
    tokenHandler(req, false, ["mail","password","create_name","auth_tags","belong_to"] );
    const result = await biz.createUserApi(req.body[0] as string,req.body[1] as string,req.body[2] as string,req.body[3] as string,req.body[4] as string);
    res.send(result);
  } catch(error) {
    errorHandler(res, error as any);
  }
});



generatedRest.get('/v1/ConfigService/get',
passport.authenticate("jwt", { session: false }) ,
async (req: express.Request, res: express.Response) => {
  const biz = new ConfigService();
  try{
    tokenHandler(req, true, [] );
    const result = await biz.get();
    res.send(result);
  } catch(error) {
    errorHandler(res, error as any);
  }
});



