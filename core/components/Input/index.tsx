'use client';

import React from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

export interface CoreInputProps extends AntdInputProps {}

export const CoreInput: React.FC<CoreInputProps> & {
  TextArea: typeof AntdInput.TextArea;
  Search: typeof AntdInput.Search;
  Password: typeof AntdInput.Password;
  OTP: typeof AntdInput.OTP;
} = (props) => {
  return <AntdInput {...props} />;
};

CoreInput.TextArea = AntdInput.TextArea;
CoreInput.Search = AntdInput.Search;
CoreInput.Password = AntdInput.Password;
CoreInput.OTP = AntdInput.OTP;

export default CoreInput;
