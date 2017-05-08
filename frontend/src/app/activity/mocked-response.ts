import {HttpMethod} from '../shared/api.model';
export interface MockedResponse {
  timestamp: number;
  duration: number;
  name: string;
  path: string;
  method: HttpMethod;
  params: string;
}
