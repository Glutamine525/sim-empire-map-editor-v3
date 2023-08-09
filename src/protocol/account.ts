import { BaseRes } from './';

export enum LoginType {
  Password = 'password',
  Code = 'code',
}

export interface SmsCodeReq {
  phone: string;
}

export interface SmsCodeRes extends BaseRes {}

export interface RegisterReq {
  phone: string;
  code: string;
  password: string;
}

export interface RegisterRes extends BaseRes {}

export interface LoginReq {
  type: LoginType;
  phone: string;
  code?: string;
  password?: string;
}

export interface LoginRes extends BaseRes {}

export interface InfoRes extends BaseRes {
  data: {
    test: string;
  };
}
