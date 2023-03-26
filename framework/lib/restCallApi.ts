import axios from "axios";
import { Session } from "./Session";
import { Response } from "./Response";
import { ErrorType } from './ErrorType';
import { ErrorHandler } from "./ErrorHandler";

export const restCallApi = async <T extends Response<any>> (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  sendData: any,
  token:string
): Promise<T> => {
  let response;
  // トークンが取れないならログアウトしてリロード（ログインしなおして同じ画面へ移動してくる）
  // 送るデータにトークンをセット
  sendData.token = token;

  let param = sendData;
  try {
    switch (method) {
      case 'get':
        param = { params: sendData };
        response = await axios.get<T>(path, param);
        break;
      case 'post':
        response = await axios.post<T>(path, param);
        break;
      case 'put':
        response = await axios.put<T>(path, param);
        break;
      case 'delete':
        response = await axios.delete<T>(path, param);
        break;
    }
  } catch (e) {
    const error = `${e}`;
    console.info(error.includes('403'));

    if (error.includes('403') === true) {
      Session.onTimeout();
    }
    if (error.includes('401') === true) {
      Session.onReAuthorize();
    }
    throw new Error(error);
  }

  // StatusがOKなら、予期したエラー（入力チェック違反や準正常エラーなど）
  if (response.data.hasError && response.data.status !== ErrorType.OK) {
    ErrorHandler.atResponseError(response.data);
    return response.data;
  }
  return response.data;
}



