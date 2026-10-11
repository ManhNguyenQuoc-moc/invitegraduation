'use client';

import React from 'react';
import { Form as AntdForm, FormProps as AntdFormProps } from 'antd';

export type CoreFormProps<Values = any> = AntdFormProps<Values>;

export const CoreForm = AntdForm;

export default CoreForm;
