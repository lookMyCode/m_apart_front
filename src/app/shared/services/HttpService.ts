import axios from 'axios';
import { BASE_URL } from '../models/constants/BASE_URL';


type AxiosConfig = {[k: string]: any};


const DEFAULT_AXIOS_CONFIG = {
  baseURL: BASE_URL,
  transformResponse: [
    (data: string, _: any, status: number) => {
      if (status === 401) {
        location.href = '/login';
        return false;
      }
  
      let resp
  
    try {
      resp = JSON.parse(data)
    } catch (error) {
      throw Error(`[requestClient] Error parsing response JSON data - ${JSON.stringify(error)}`);
    }
  
      return resp;
    },
  ]
}

function getDefaultAxiosConfig(): any {
  return DEFAULT_AXIOS_CONFIG;
}


export class HttpService {
  static instance = axios.create(getDefaultAxiosConfig());

  static getInstance() {
    return this.instance;
  }

  static setInstance(config: AxiosConfig) {
    this.instance = axios.create({
      ...getDefaultAxiosConfig(),
      ...config,
    });
  }

  static send(url: string, config?: AxiosConfig) {
    return this.instance.request({
      url,
      ...(config || {}),
    });
  }

  static get(url: string, config?: AxiosConfig) {
    return this.send(url, {
      method: 'GET',
      ...(config || {}),
    });
  }

  static post(url: string, data: any, config?: AxiosConfig) {
    return this.send(url, {
      method: 'POST',
      data,
      ...(config || {}),
    });
  }

  static patch(url: string, data: any, config?: AxiosConfig) {
    return this.send(url, {
      method: 'PATCH',
      data,
      ...(config || {}),
    });
  }

  static put(url: string, data: any, config?: AxiosConfig) {
    return this.send(url, {
      method: 'PUT',
      data,
      ...(config || {}),
    });
  }

  static delete(url: string, data: any, config?: AxiosConfig) {
    return this.send(url, {
      method: 'DELETE',
      data,
      ...(config || {}),
    });
  }
}
