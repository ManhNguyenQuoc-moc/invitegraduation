// Providers & Theme
export { AntdProvider } from './providers/AntdProvider';
export { antdThemeConfig } from './theme/themeConfig';

// Wrapped Core Components
export { CoreButton } from './components/Button';
export { CoreInput } from './components/Input';
export { CoreModal } from './components/Modal';
export { CoreTable } from './components/Table';
export { CoreSelect } from './components/Select';
export { CoreCard } from './components/Card';
export { CoreForm } from './components/Form';

// Re-export commonly used Antd components & icons for convenience
export {
  Tag as CoreTag,
  Badge as CoreBadge,
  Spin as CoreSpin,
  Tooltip as CoreTooltip,
  Popconfirm as CorePopconfirm,
  Tabs as CoreTabs,
  Avatar as CoreAvatar,
  Divider as CoreDivider,
  Row as CoreRow,
  Col as CoreCol,
  Space as CoreSpace,
  Typography as CoreTypography,
  App as CoreApp,
  message,
  notification,
  Modal as AntdModalHelper,
} from 'antd';
