'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import ModalUI from '../../ui/modal.ui';
import { addItem, AddMonitorState } from '@/app/actions/monitor.action';
import { Form, Input, Tooltip } from 'antd';
import { Select, Space, message } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons';
import { HourlyPlan } from '@/enum/app.enum';
import Image from 'next/image';

type LayoutType = Parameters<typeof Form>[0]['layout'];

export default function AddMonitorModal() {
  const [form] = Form.useForm();
  const [formLayout] = useState<LayoutType>('vertical');
  const [interval, setInterval] = useState(`${HourlyPlan.HALF_DAY}`);

  const [state, formAction, pending] = useActionState<AddMonitorState, FormData>(addItem, {});
  const [messageApi, contextHolder] = message.useMessage();

  const [isOpen, setIsOpen] = useState(false);

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Successfully added',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: "There's and error",
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleChange = (value: string) => {
    setInterval(value);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const formData = new FormData();

    const { name, url } = values;

    console.log(values);

    if (name) formData.append('name', name);
    if (url) formData.append('url', url);
    if (interval) formData.append('interval', interval);

    if (!name || !url || !interval) return;

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      form.resetFields();
      success();
    }

    if (state.errors) {
      error();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      {contextHolder}
      <div className="w-full h-full relative grid place-items-center group">
        <div className="absolute grid place-items-center inset-0 z-10">
          <div className="group-hover:bg-gray-600 bg-gray-300 opacity-20 transition-colors duration-300 absolute inset-0" />
          <Tooltip title="Add new site">
            <PlusSquareFilled
              className="text-7xl text-gray-500! duration-500 group-hover:scale-100 scale-90 group-hover:animate-pulse hover:animate-none transition-transform"
              onClick={handleOpen}
            />
          </Tooltip>
        </div>
        <Image src="/illustration/chart.svg" alt="Add monitor chart" height={500} width={500} />
      </div>

      <ModalUI
        open={isOpen}
        title="Add Monitoring"
        okText="Add to monitoring"
        okButtonProps={{ color: 'primary', variant: 'solid', htmlType: 'submit' }}
        cancelButtonProps={{ color: 'primary', variant: 'outlined' }}
        cancelText="Cancel"
        onCancel={() => setIsOpen(false)}
        confirmLoading={pending}
        onOk={handleOk}
      >
        <Form
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
            validateStatus={state.errors?.name ? 'error' : ''}
            help={state.errors?.name?.join(', ')}
          >
            <Input placeholder="Example site" className="placeholder:italic" />
          </Form.Item>

          <Form.Item
            label="Url"
            name="url"
            rules={[{ required: true }]}
            validateStatus={state.errors?.url ? 'error' : ''}
            help={state.errors?.url?.join(', ')}
          >
            <Input
              placeholder="https://example.site"
              inputMode="url"
              className="placeholder:italic"
            />
          </Form.Item>

          <Form.Item label="Interval (in hour)">
            <Space className="w-full">
              <Select
                defaultValue={HourlyPlan.HALF_DAY.toString()}
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                  HourlyPlan.HOURLY,
                  HourlyPlan.QUARTERLY,
                  HourlyPlan.HALF_DAY,
                  HourlyPlan.DAILY,
                ].map((plan) => ({
                  value: plan,
                  label: plan,
                }))}
              />
            </Space>
          </Form.Item>

          {state.errors?.custom && (
            <p className="text-red-500 mt-1 ml-1">{state.errors.custom.join(', ')}</p>
          )}
        </Form>
      </ModalUI>
    </>
  );
}
