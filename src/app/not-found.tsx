'use client';

import { Space } from 'antd';
import Image from 'next/image';

export default function NotFound() {
  return (
    <Space direction="vertical" align="center" className="w-full">
      <h1 className="font-anton text-2xl lg:text-4xl">Page not found!</h1>
      <Image src="/illustration/error/404.svg" alt="404 page not found" height={500} width={500} />
    </Space>
  );
}
