import { Button, Card, Result, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

type State = { orderId?: string };

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = (location.state as State | null)?.orderId ?? 'ORD-UNKNOWN';

  return (
    <Card>
      <Result
        status="success"
        title="订单已确认"
        subTitle={
          <>
            <Typography.Paragraph>订单编号：{orderId}</Typography.Paragraph>
            <Typography.Paragraph type="secondary">预计到达：约 45 分钟（示意）</Typography.Paragraph>
          </>
        }
        extra={
          <Button type="primary" onClick={() => navigate(`/orders/${orderId}/tracking`)}>
            跟踪我的交付
          </Button>
        }
      />
      <Typography.Paragraph type="secondary">
        占位：UI-PAY-03（US-5.3 确认屏）。
      </Typography.Paragraph>
    </Card>
  );
}
