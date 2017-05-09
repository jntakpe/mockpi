import { HttpMethod } from '../shared/api.model';

export interface MockedResponse {
  timestamp: string;
  duration: number;
  name: string;
  path: string;
  method: HttpMethod;
  params: string;
}
