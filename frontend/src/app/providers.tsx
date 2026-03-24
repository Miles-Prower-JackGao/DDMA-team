import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { ReactNode } from 'react';
import { antdTheme } from '@/theme/antdTheme';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
