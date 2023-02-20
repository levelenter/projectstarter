import { ErrorType } from './ErrorType';
import jwt from 'jsonwebtoken';
import config from 'config';
import { ErrorResult } from './ErrorResult';

/**
 * パラメータをBodyとQueryから取り出して配列にする
 * @param target
 * @param names
 * @returns
 */
const getParam = (target, names: string[]): { name: string; value: string }[] => {
  const returnValues:any[] = [];
  for (const key of Object.keys(target)) {
    console.log('body item ', names[key], target[key]);

    // names配列はサーバーメソッドのリフレクションから生成している
    // namesにないものがあればそれはクライアントで付加しているトークンなのでundefinedならtoken
    returnValues.push({ name: names[key] ? names[key] : 'token', value: target[key] });
  }
  return returnValues;
};

export const tokenHandler = (req, isRequireToken: boolean, names: string[]) => {
  // トークンが必要ないメソッドの場合はスルー
  if (!isRequireToken) return;
  const params = [...getParam(req.body, names), ...getParam(req.query, names)];
  // console.log('params', params);
  const userIdParam = params.find((i) => i.name === 'user_id');
  const tokenParam = params.find((i) => i.name === 'token');
  if (!userIdParam) return;
  if(!tokenParam) return;
  const userId = userIdParam.value;

  const tokenObject: any = !tokenParam.value ? {} : tokenParam.value;
  const decodedToken = jwt.decode(tokenObject, config.get('secret'));
  if (`${decodedToken.userId}` !== `${userId}`) {
    throw new ErrorResult(
      '認証エラー再ログインしてください',
      ErrorType.UNAUTHORIZED_ERROR,
      true,
      ''
    );
  }
  console.log('decodedToken', decodedToken, decodedToken.userId, userId);
  console.log('test', req.url, isRequireToken, params);
};
