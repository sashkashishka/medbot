import { ConfigProvider } from 'antd';

interface iProps {
  children: React.ReactNode | React.ReactNode[];
}

export function AppProvider({ children }: iProps) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
