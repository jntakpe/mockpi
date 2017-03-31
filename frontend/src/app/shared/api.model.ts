// Generated using typescript-generator version 1.21.304 on 2017-03-31 14:33:51.

export interface Mock {
  name: string;
  request: Request;
  response: Response;
  collection: string;
  delay: number;
  description: string;
}

export interface Request {
  path: string;
  method: RequestMethod;
  params: { [index: string]: string };
  headers: { [index: string]: string };
}

export interface Response {
  body: string;
  status: number;
  contentType: string;
  encoding: string;
}

export interface User {
  login: string;
  name: string;
  email: string;
}

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
