import { Space } from 'antd';

export default function CancelPage() {
  return (
    <Space direction="vertical">
      <h1>Payment cancelled</h1>
      <p>
        Your payment was not completed. No charges were made. You can try again or contact support
        if you need help.
      </p>
    </Space>
  );
}
