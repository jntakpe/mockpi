// Generated using typescript-generator version 1.21.304 on 2017-08-28 20:39:27.

export interface Activity {
  id: any;
  mock: Mock;
  calls: Call[];
}

export interface Call {
  timestamp: any;
  duration: any;
}

export interface Mock {
    name: string;
    request: Request;
    response: Response;
    collection: string;
    delay: number;
    description: string;
    id: any;
}

export interface Request {
    path: string;
    method: HttpMethod;
    params: { [index: string]: string };
    headers: { [index: string]: string };
}

export interface Response {
    body: string;
    status: number;
    contentType: string;
}

export interface User {
    username: string;
    name: string;
    email: string;
}

export interface ActivityDTO {
  name: string;
  path: string;
  method: HttpMethod;
  params: { [index: string]: string };
  calls: Call[];
}

export interface IdName {
  name: string;
  id: string;
}

export interface IdRequest {
  request: Request;
  id: string;
}

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
