'use client';

import { deleteItem } from '@/app/actions/monitor.action';
import ButtonCommon from '@/components/client/ui/button.ui';
import { useState, useTransition } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import ModalUI from '../../ui/modal.ui';

import { WarningTwoTone } from '@ant-design/icons';
import { message } from 'antd';

interface DeleteUptimeProps {
  id: string;
}

export default function DeleteUptimeButton({ id }: DeleteUptimeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteItemWithId = deleteItem.bind(null, id);

  const [messageApi, contextHolder] = message.useMessage();

  const [pending, startTransition] = useTransition();

  const success = () =>
    messageApi.open({
      type: 'success',
      content: 'Successfully deleted',
    });

  const error = () => messageApi.open({ type: 'error', content: 'Error deleting item!' });

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteItemWithId();
        setIsOpen(false);
        success();
      } catch {
        error();
      }
    });
  };

  const handleConfirm = () => {
    setIsOpen(true);
  };

  return (
    <>
      {contextHolder}
      <ModalUI
        open={isOpen}
        title="Delete Monitoring Site"
        onOk={handleDelete}
        okText="Yes, I Delete"
        okButtonProps={{ color: 'danger', variant: 'solid' }}
        cancelButtonProps={{ color: 'primary', variant: 'outlined' }}
        cancelText="Cancel"
        confirmLoading={pending}
        onCancel={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-lg">Are you sure you want to delete this monitoring site?</p>
          <p>
            <WarningTwoTone className="text-red-500" /> This action cannot be undone and will{' '}
            <strong>permanently</strong> remove all associated data.
          </p>
        </div>
      </ModalUI>
      <ButtonCommon
        text="Delete"
        color="danger"
        variant="outlined"
        icon={<DeleteOutlined />}
        onClick={handleConfirm}
      />
    </>
  );
}
