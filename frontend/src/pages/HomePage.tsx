import { Button, Card, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Card title="首页">
      <Typography.Paragraph>
        MVP 流程：创建订单 → 交付选项 → 结账审查 → 支付 → 确认 → 实时跟踪 → 历史。
      </Typography.Paragraph>
      <Space wrap>
        <Button type="primary" onClick={() => navigate('/order')}>
          开始：创建订单
        </Button>
        <Button onClick={() => navigate('/history')}>订单历史</Button>
      </Space>
    </Card>
  );
}
