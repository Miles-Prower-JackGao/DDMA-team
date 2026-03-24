import { Button, Card, Descriptions, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

export function CheckoutReviewPage() {
  const navigate = useNavigate();

  return (
    <Card title="订单摘要审查">
      <Typography.Paragraph type="secondary">
        占位：UI-PAY-01（US-5.1），各字段可链回向导编辑。
      </Typography.Paragraph>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="取货">示例地址 A</Descriptions.Item>
        <Descriptions.Item label="送货">示例地址 B</Descriptions.Item>
        <Descriptions.Item label="车辆">地面机器人</Descriptions.Item>
        <Descriptions.Item label="ETA">约 45 分钟</Descriptions.Item>
        <Descriptions.Item label="费用">$12.00</Descriptions.Item>
      </Descriptions>
      <Space style={{ marginTop: 24 }} wrap>
        <Button onClick={() => navigate('/order')}>返回编辑</Button>
        <Button type="primary" onClick={() => navigate('/checkout/pay')}>
          去支付
        </Button>
      </Space>
    </Card>
  );
}
