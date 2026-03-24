import { Button, Card, Form, Input, Steps, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

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
      <Card style={{ width: 440 }} title="注册">
        <Steps
          size="small"
          current={step}
          items={[{ title: '基本信息' }, { title: 'OTP 验证' }]}
          style={{ marginBottom: 24 }}
        />
        {step === 0 ? (
          <Form layout="vertical" onFinish={() => setStep(1)}>
            <Typography.Paragraph type="secondary">
              占位：UI-AUTH-01，对接 US-1.1 注册与 OTP。
            </Typography.Paragraph>
            <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="邮箱或手机" name="identifier" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              发送验证码
            </Button>
          </Form>
        ) : (
          <Form
            layout="vertical"
            onFinish={() => navigate('/login')}
          >
            <Form.Item label="验证码" name="otp" rules={[{ required: true }]}>
              <Input.OTP length={6} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              完成注册
            </Button>
            <Button type="link" onClick={() => setStep(0)} block>
              返回上一步
            </Button>
          </Form>
        )}
        <div style={{ marginTop: 16 }}>
          <Link to="/login">已有账户？去登录</Link>
        </div>
      </Card>
    </div>
  );
}
