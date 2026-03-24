import { Button, Card, QRCode, Space, Steps, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

export function TrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title={`实时跟踪 · ${orderId ?? ''}`}>
        <Typography.Paragraph type="secondary">
          占位：UI-TRK-01（Google Maps + 车辆动画）、UI-TRK-03 下方步骤可合并展示。
        </Typography.Paragraph>
        <div
          style={{
            height: 280,
            background: '#e6f4ff',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          地图占位
        </div>
      </Card>
      <Card title="订单进度">
        <Steps
          current={2}
          items={[
            { title: '已调度' },
            { title: '前往取货' },
            { title: '取货中' },
            { title: '派送中' },
            { title: '已交付' },
          ]}
        />
      </Card>
      <Card title="解锁 PIN / QR">
        <Typography.Paragraph>您的取货 PIN：</Typography.Paragraph>
        <Typography.Title level={2} style={{ letterSpacing: 8 }}>
          4829
        </Typography.Title>
        <QRCode value={`UNLOCK:${orderId}:4829`} />
        <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
          占位：UI-TRK-02（US-6.2）。
        </Typography.Paragraph>
      </Card>
      <Button onClick={() => navigate('/history')}>查看订单历史</Button>
    </Space>
  );
}
