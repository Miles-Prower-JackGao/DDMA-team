import { Button, Card, Result, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

interface ConfirmationState {
  orderId?: string;
  handoffPin?: string;
  etaMinutes?: number;
  totalAmount?: number;
  vehicleType?: string;
}

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ConfirmationState | null) ?? {};

  const orderId = state.orderId ?? 'N/A';
  const handoffPin = state.handoffPin ?? '------';
  const etaMinutes = state.etaMinutes ?? 0;
  const totalAmount = state.totalAmount;

  return (
    <Card>
      <Result
        status="success"
        title="订单已确认"
        subTitle={
          <>
            <Typography.Paragraph>订单编号：{orderId}</Typography.Paragraph>
            {totalAmount !== undefined && (
              <Typography.Paragraph>已支付：${totalAmount.toFixed(2)}</Typography.Paragraph>
            )}
            <Typography.Paragraph type="secondary">
              预计送达：约 {etaMinutes} 分钟
            </Typography.Paragraph>
            <div
              style={{
                margin: '16px auto',
                padding: '16px 32px',
                background: '#F7F9FF',
                borderRadius: 12,
                display: 'inline-block',
                border: '2px solid #E5EAFF',
              }}
            >
              <Typography.Text
                type="secondary"
                style={{ display: 'block', fontSize: 12, marginBottom: 4 }}
              >
                取件 PIN 码
              </Typography.Text>
              <Typography.Title
                level={1}
                style={{ margin: 0, letterSpacing: 8, color: '#4F6EF7', fontVariantNumeric: 'tabular-nums' }}
              >
                {handoffPin}
              </Typography.Title>
            </div>
          </>
        }
        extra={
          <Button
            type="primary"
            size="large"
            onClick={() => navigate(`/orders/${orderId}/tracking`)}
          >
            追踪配送
          </Button>
        }
      />
    </Card>
  );
}
