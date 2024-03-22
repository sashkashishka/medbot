import { useState } from 'react';
import { Avatar, Dropdown, Flex, Layout, Typography, theme } from 'antd';
import { useStore } from '@nanostores/react';

import { $admin } from '../../../stores/admin';
import { $logout } from '../../../stores/auth';

import { SidebarMenu } from './Menu';

const { Header, Content, Sider } = Layout;

interface iProps {
  children: React.ReactNode | React.ReactNode[];
}

export function DashboardLayout({ children }: iProps) {
  const admin = useStore($admin);
  const { mutate: logout } = useStore($logout);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, paddingMD, marginMD },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <SidebarMenu />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer }}>
          <Flex
            align="center"
            justify="space-between"
            style={{ height: '100%' }}
          >
            <Typography.Title level={2} style={{ margin: 0 }}>
              Medbot admin panel
            </Typography.Title>

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    danger: true,
                    label: <div onClick={logout}>Logout</div>,
                  },
                ],
              }}
            >
              <Avatar shape="circle" style={{ cursor: 'pointer' }}>
                {admin.data?.name?.slice?.(4) || 'U'}
              </Avatar>
            </Dropdown>
          </Flex>
        </Header>
        <Content style={{ margin: marginMD }}>
          <div
            style={{
              padding: paddingMD,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
