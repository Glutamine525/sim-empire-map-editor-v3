const baseUnknownText = '未知错误，请稍后再试';

export enum AccountErrorCode {
  Debug = -1,
  Success,
  ParamsError = 1000,
  LimitControl,
  CodeError,
  Unknown = 9000,
}

export const AccountErrorText: { [key in AccountErrorCode]: string } = {
  [AccountErrorCode.Debug]: '',
  [AccountErrorCode.Success]: '成功',
  [AccountErrorCode.ParamsError]: '参数错误',
  [AccountErrorCode.LimitControl]: '请勿频繁发送验证码',
  [AccountErrorCode.CodeError]: '验证码错误',
  [AccountErrorCode.Unknown]: baseUnknownText,
};
