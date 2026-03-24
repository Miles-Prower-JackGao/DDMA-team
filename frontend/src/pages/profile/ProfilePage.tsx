import { Card, Form, Input, Button, Typography } from 'antd';

export function ProfilePage() {
  return (
    <Card title="用户资料">
      <Typography.Paragraph type="secondary">
        占位：UI-AUTH-05（US-1.4），P1 冲刺实现。
      </Typography.Paragraph>
      <Form layout="vertical" style={{ maxWidth: 400 }}>
        <Form.Item label="姓名">
          <Input placeholder="张三" />
        </Form.Item>
        <Form.Item label="手机">
          <Input placeholder="+1..." />
        </Form.Item>
        <Form.Item label="邮箱">
          <Input placeholder="user@example.com" />
        </Form.Item>
        <Button type="primary">保存（占位）</Button>
      </Form>
    </Card>
  );
}
