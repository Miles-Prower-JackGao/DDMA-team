import { Alert, Button, Card, Spin, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { payOrder } from '../../api/client';

interface OrderDraft {
  orderId: string;
}

interface PlanChoice {
  vehicleType: string;
  priceUsd: number;
  etaMinutes: number;
}

function loadJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft = loadJson<OrderDraft>('order_draft');
  const plan = loadJson<PlanChoice>('plan_choice');
  const orderId = searchParams.get('orderId') ?? draft?.orderId;

  if (!plan || !orderId) {
    return (
      <Card title="支付">
        <Alert
          type="warning"
          showIcon
          message="订单信息不完整，请重新下单。"
          style={{ marginBottom: 16 }}
        />
        <Button onClick={() => navigate('/order')}>返回下单</Button>
      </Card>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await payOrder(orderId, {
        vehicle_type: plan.vehicleType,
        price_usd: plan.priceUsd,
        eta_minutes: plan.etaMinutes,
      });
      navigate('/checkout/confirmation', {
        state: {
          orderId: result.order_id,
          handoffPin: result.handoff_pin,
          etaMinutes: result.eta_minutes,
          totalAmount: result.total_amount,
          vehicleType: result.vehicle_type,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '支付失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="确认支付">
      <Typography.Paragraph>
        配送方式：{plan.vehicleType === 'DRONE' ? '无人机' : '地面机器人'}
      </Typography.Paragraph>
      <Typography.Paragraph>
        预计时间：约 {plan.etaMinutes} 分钟
      </Typography.Paragraph>
      <Typography.Title level={3} style={{ color: '#4F6EF7', marginBottom: 24 }}>
        应付：${plan.priceUsd.toFixed(2)}
      </Typography.Title>
      {error && (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
      )}
      {loading ? (
        <Spin tip="处理中..." />
      ) : (
        <Button type="primary" size="large" onClick={() => void handlePay()}>
          立即支付 ${plan.priceUsd.toFixed(2)}
        </Button>
      )}
    </Card>
  );
}
