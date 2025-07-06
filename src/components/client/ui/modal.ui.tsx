'use client';

import { Modal } from 'antd';
import type { ModalProps as ModalPropsAntd } from 'antd';

interface ModalProps extends ModalPropsAntd {
  title: string;
  children: React.ReactNode;
}

export default function ModalUI({ children, title, ...props }: ModalProps) {
  // const handleOk = () => {
  //   setConfirmLoading(true);
  //   setTimeout(() => {
  //     setOpen(false);
  //     setConfirmLoading(false);
  //   }, 2000);
  // };

  // const handleCancel = () => {
  //   setOpen(false);
  // };

  return (
    <>
      <Modal
        title={title}
        // open={open}
        // confirmLoading={confirmLoading}
        // onCancel={handleCancel}
        {...props}
      >
        {children}
      </Modal>
    </>
  );
}
