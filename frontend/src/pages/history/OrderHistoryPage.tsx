import { Button, Card, Table, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const demoRows = [
  { id: 'ORD-DEMO-001', date: '2026-03-20', status: '派送中', total: '$12.00' },
  { id: 'ORD-DEMO-000', date: '2026-03-10', status: '已交付', total: '$9.50' },
];

export function OrderHistoryPage() {
  const navigate = useNavigate();

  return (
    <Card title="订单历史">
      <Typography.Paragraph type="secondary">
        占位：UI-HIST-01（US-7.1），对接订单历史 API。
      </Typography.Paragraph>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={demoRows}
        columns={[
          { title: '订单 ID', dataIndex: 'id' },
          { title: '日期', dataIndex: 'date' },
          {
            title: '状态',
            dataIndex: 'status',
            render: (s: string) => <Tag>{s}</Tag>,
          },
          { title: '费用', dataIndex: 'total' },
          {
            title: '操作',
            render: (_, row) => (
              <Button type="link" onClick={() => navigate(`/orders/${row.id}/tracking`)}>
                跟踪
              </Button>
            ),
          },
        ]}
      />
    </Card>
  );
}
