// Generated using typescript-generator version 1.21.304 on 2017-05-04 22:58:36.

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

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
