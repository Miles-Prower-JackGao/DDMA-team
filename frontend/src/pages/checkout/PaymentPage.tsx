import { Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

export function PaymentPage() {
  const navigate = useNavigate();

  return (
    <Card title="支付">
      <Typography.Paragraph type="secondary">
        占位：UI-PAY-02（Stripe Elements）。此处用按钮模拟支付成功。
      </Typography.Paragraph>
      <Button
        type="primary"
        onClick={() => navigate('/checkout/confirmation', { state: { orderId: 'ORD-DEMO-001' } })}
      >
        模拟支付成功
      </Button>
    </Card>
  );
}
