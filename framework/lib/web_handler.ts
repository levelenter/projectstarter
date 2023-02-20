import express from 'express';
import { ErrorResult } from './ErrorResult';
import { Response } from './Response';

export const errorHandler = (res: express.Response, error: ErrorResult | Error) => {
  console.error('go', error.message);
  if (error instanceof ErrorResult) {
    console.error('準正常形エラー', error);
    const errorResponse = new Response(error.description);
    errorResponse.hasError = error.hasError!;
    errorResponse.errorDescription = error.description!;
    errorResponse.errorExpandedData = error.errorExpandedData;
    res.status(error.status!).send(errorResponse);
  } else {
    console.error(error);
    res.status(500).send(error);
  }
};
