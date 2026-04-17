import { Alert, Button, Card, Descriptions, Space, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface OrderDraft {
  orderId: string;
  pickupAddress: string;
  dropoffAddress: string;
  parcel: { sizeTier: string; weightKg: number; fragile: boolean };
}

interface PlanChoice {
  vehicleType: string;
  priceUsd: number;
  etaMinutes: number;
}

function loadDraft(): OrderDraft | null {
  try {
    const raw = sessionStorage.getItem('order_draft');
    return raw ? (JSON.parse(raw) as OrderDraft) : null;
  } catch {
    return null;
  }
}

function loadPlanChoice(): PlanChoice | null {
  try {
    const raw = sessionStorage.getItem('plan_choice');
    return raw ? (JSON.parse(raw) as PlanChoice) : null;
  } catch {
    return null;
  }
}

export function CheckoutReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const draft = loadDraft();
  const plan = loadPlanChoice();
  const orderId = searchParams.get('orderId') ?? draft?.orderId;

  if (!draft || !plan || !orderId) {
    return (
      <Card title="订单摘要">
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

  const vehicleLabel = plan.vehicleType === 'DRONE' ? '无人机' : '地面机器人';

  return (
    <Card title="订单摘要">
      <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="取货地址">{draft.pickupAddress}</Descriptions.Item>
        <Descriptions.Item label="送货地址">{draft.dropoffAddress}</Descriptions.Item>
        <Descriptions.Item label="包裹规格">
          {draft.parcel.sizeTier} · {draft.parcel.weightKg} kg
          {draft.parcel.fragile ? ' · 易碎' : ''}
        </Descriptions.Item>
        <Descriptions.Item label="配送方式">{vehicleLabel}</Descriptions.Item>
        <Descriptions.Item label="预计时间">约 {plan.etaMinutes} 分钟</Descriptions.Item>
        <Descriptions.Item label="配送费">
          <Typography.Text strong style={{ fontSize: 18, color: '#4F6EF7' }}>
            ${plan.priceUsd.toFixed(2)}
          </Typography.Text>
        </Descriptions.Item>
      </Descriptions>
      <Space wrap>
        <Button onClick={() => navigate('/order')}>返回编辑</Button>
        <Button
          type="primary"
          onClick={() => navigate(`/checkout/pay?orderId=${encodeURIComponent(orderId)}`)}
        >
          去支付 ${plan.priceUsd.toFixed(2)}
        </Button>
      </Space>
    </Card>
  );
}
