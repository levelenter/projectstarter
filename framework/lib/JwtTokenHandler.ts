import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

export class JwtTokenHandler {
  getUserIdInRequest(req: express.Request) {
    let user_id = '';
    if (req.body && req.body.user_id) {
      user_id = req.body.token;
    }
    if (req.query && (req.query as any).user_id) {
      user_id = (req.query as any).user_id;
    }
    if (user_id) {
      return user_id;
    }
  }

  getTokestring(req: express.Request) {
    let token = '';
    if (req.body && req.body.token) {
      token = req.body.token;
    }
    if (req.query && (req.query as any).token) {
      token = (req.query as any).token;
    }
    if (req.headers && req.headers['x-access-token']) {
      token = req.headers['x-access-token'] as string;
    }
    if (token) {
      // 設定されていたトークンの値の正当性を確認
      try {
        const decodedTokent = jwt.decode(token, config.get('secret'));

        return `user_id:${decodedTokent!.user_id}`;
      } catch (e) {
        return `token decode error ${JSON.stringify(e)}`;
      }
    }
    return '';
  }
}
