'use client';

import { Alert } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

export default function InfoTestCard() {
  return (
    <Alert
      message={
        <p>
          Test cards for payment{' '}
          <a href="https://docs.stripe.com/testing#cards" target="_blank">
            https://docs.stripe.com/testing#cards
          </a>
        </p>
      }
      type="info"
      className="w-fit! mx-auto! px-10!"
      showIcon
      icon={<WarningTwoTone />}
    />
  );
}
