import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type LocationState = { from?: { pathname: string } };

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }} title="登录">
        <Typography.Paragraph type="secondary">
          占位：对接 US-1.2 登录 API 与 JWT。点击下方按钮可模拟登录以浏览 MVP 路由。
        </Typography.Paragraph>
        <Form
          layout="vertical"
          onFinish={() => {
            login();
            navigate(from, { replace: true });
          }}
        >
          <Form.Item label="邮箱或手机" name="identifier" rules={[{ required: true }]}>
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <Link to="/register">没有账户？去注册</Link>
      </Card>
    </div>
  );
}
