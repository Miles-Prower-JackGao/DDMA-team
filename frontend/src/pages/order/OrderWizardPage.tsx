import { Button, Card, Input, InputNumber, Radio, Space, Steps, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function OrderWizardPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: '地址',
      content: (
        <>
          <Typography.Paragraph type="secondary">
            占位：UI-ORD-01 / UI-ADDR-01 / UI-ADDR-02（地图自动完成与服务区域横幅）。
          </Typography.Paragraph>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Typography.Text>取货地址（示意）</Typography.Text>
              <Input placeholder="将接入 Google Places 自动完成" />
            </div>
            <div>
              <Typography.Text>送货地址（示意）</Typography.Text>
              <Input placeholder="将接入 Google Places 自动完成" />
            </div>
          </Space>
        </>
      ),
    },
    {
      title: '包裹',
      content: (
        <>
          <Typography.Paragraph type="secondary">
            占位：UI-PKG-01 尺寸卡片与重量（Ant Design Card / InputNumber）。
          </Typography.Paragraph>
          <Space direction="vertical" size="middle">
            <div>
              <Typography.Text>尺寸</Typography.Text>
              <div style={{ marginTop: 8 }}>
                <Radio.Group defaultValue="small">
                  <Radio.Button value="small">小</Radio.Button>
                  <Radio.Button value="medium">中</Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <div>
              <Typography.Text>重量 (kg)</Typography.Text>
              <InputNumber min={0.1} max={50} step={0.1} defaultValue={1} style={{ display: 'block', marginTop: 8 }} />
            </div>
          </Space>
        </>
      ),
    },
    {
      title: '选项',
      content: (
        <Typography.Paragraph type="secondary">
          占位：可在此汇总备注或偏好；下一步进入推荐引擎结果页。
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Card title="创建订单">
      <Steps current={current} items={steps.map((s) => ({ title: s.title }))} style={{ marginBottom: 24 }} />
      <div style={{ minHeight: 160, marginBottom: 24 }}>{steps[current].content}</div>
      <Space>
        {current > 0 && <Button onClick={() => setCurrent((c) => c - 1)}>上一步</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => setCurrent((c) => c + 1)}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => navigate('/recommendations')}>
            查看交付选项
          </Button>
        )}
      </Space>
    </Card>
  );
}
