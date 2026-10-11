'use client';

import React from 'react';
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';

export interface CoreSelectProps<ValueType = any, OptionType extends object = any>
  extends AntdSelectProps<ValueType, OptionType> {}

export function CoreSelect<ValueType = any, OptionType extends object = any>(
  props: CoreSelectProps<ValueType, OptionType>
) {
  return <AntdSelect<ValueType, OptionType> {...props} />;
}

export default CoreSelect;
