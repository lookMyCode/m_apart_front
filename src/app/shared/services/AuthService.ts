import { BASE_URL } from "../models/constants/BASE_URL";
import { HttpService } from "./HttpService";
import * as CryptoJS from 'crypto-js';

export class AuthService {
  private static _accessToken?: string | null;
  readonly baseURL = BASE_URL;

  static get accessToken() {
    if (!this._accessToken) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && !['undefined', 'null'].includes(accessToken)) this.accessToken = accessToken;
    }

    return this._accessToken;
  }

  static set accessToken(accessToken: string | undefined | null) {
    this._accessToken = accessToken;
    localStorage.setItem('accessToken', accessToken || '');
    HttpService.setInstance({
      headers: {
        'Authorization': `Bearer ${accessToken || ''}`,
      }
    });
  }

  static get isAuth() {
    return !!this.accessToken;
  }

  static logout() {
    this.accessToken = null;
  }

  static async login(data: {login: string, password: string}) {
    const password = CryptoJS.SHA512(`${data.login}_${data.password}`).toString();
    const resp = await HttpService.post('/login', {
      login: data.login,
      password,
    });

    const { accessToken } = resp.data;
    this.accessToken = accessToken;
    
    return true;
  }
}
