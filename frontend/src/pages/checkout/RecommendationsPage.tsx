import { Button, Card, Space, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

export function RecommendationsPage() {
  const navigate = useNavigate();

  return (
    <Card title="交付选项">
      <Typography.Paragraph type="secondary">
        占位：UI-REC-01 / UI-REC-02（机器人 vs 无人机卡片、最快/最便宜/最佳徽章、不可用 Tooltip）。
      </Typography.Paragraph>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Card size="small" title="地面机器人" extra={<Tag color="gold">⭐ 最佳</Tag>}>
          ETA 约 45 分钟 · $12.00
        </Card>
        <Card size="small" type="inner" title="无人机" extra={<Tag>⚡ 最快</Tag>}>
          ETA 约 28 分钟 · $18.00
        </Card>
      </Space>
      <Button type="primary" style={{ marginTop: 24 }} onClick={() => navigate('/checkout')}>
        选择并继续结账
      </Button>
    </Card>
  );
}
