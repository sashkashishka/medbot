import { useState } from 'react';
import { Layout, Menu } from 'antd';

import styles from './Dashboard.module.css';

const { Header, Content, Sider } = Layout;

interface iProps {
  children: React.ReactNode | React.ReactNode[];
}

export function DashboardLayout({ children }: iProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={[{ key: 1, label: '123' }]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: 'green' }}>sdjfkshdf</Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: 'white',
              borderRadius: '16px',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
