import {
  LaptopOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <LaptopOutlined />, label: '首页' },
  { key: '/order', icon: <ShoppingOutlined />, label: '创建订单' },
  { key: '/recommendations', icon: <EnvironmentOutlined />, label: '交付选项' },
  { key: '/checkout', icon: <CreditCardOutlined />, label: '结账审查' },
  { key: '/history', icon: <HistoryOutlined />, label: '订单历史' },
  { key: '/profile', icon: <UserOutlined />, label: '资料' },
];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { token } = theme.useToken();

  const selectedKey = menuItems.reduce((best, item) => {
    const exact = location.pathname === item.key;
    const nested = item.key !== '/' && location.pathname.startsWith(`${item.key}/`);
    if (exact || nested) {
      return item.key.length > best.length ? item.key : best;
    }
    return best;
  }, '/');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth={0}>
        <div
          style={{
            height: 64,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography.Title level={4} style={{ color: token.colorWhite, margin: 0 }}>
            自治配送
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出
          </Button>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
