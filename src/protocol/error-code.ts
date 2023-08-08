const baseUnknownText = '未知错误，请稍后再试';

export enum ErrorCode {
  Debug = -1,
  Success,

  // general
  ParamsError = 1000,

  // account
  CodeLimitControl = 2000,
  CodeError,

  Unknown = 9000,
}

export const ErrorText: { [key in ErrorCode]: string } = {
  [ErrorCode.Debug]: '',
  [ErrorCode.Success]: '成功',

  // general
  [ErrorCode.ParamsError]: '参数错误',

  // account
  [ErrorCode.CodeLimitControl]: '请勿频繁发送验证码',
  [ErrorCode.CodeError]: '验证码错误',

  [ErrorCode.Unknown]: baseUnknownText,
};
