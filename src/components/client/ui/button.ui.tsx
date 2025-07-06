'use client';

import Button from 'antd/lib/button';
import type { ComponentProps } from 'react';

// Extract props from AntD's Button
type ButtonProps = ComponentProps<typeof Button> & {
  text?: string;
};

export default function ButtonUI({ onClick, text, ...props }: ButtonProps) {
  return (
    <Button color="geekblue" variant="solid" className="text-base!" onClick={onClick} {...props}>
      {text}
    </Button>
  );
}
