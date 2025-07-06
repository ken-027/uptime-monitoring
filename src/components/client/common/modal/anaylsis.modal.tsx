'use client';

import { useState } from 'react';
import ModalUI from '../../ui/modal.ui';
import { Form } from 'antd';
import { SiteAnalysis } from '@/types/model';
import ButtonUI from '../../ui/button.ui';
import { InfoCircleOutlined } from '@ant-design/icons';

type LayoutType = Parameters<typeof Form>[0]['layout'];

type Analysis = Pick<
  SiteAnalysis,
  'siteType' | 'tech' | 'brokenLink' | 'description' | 'performance' | 'seoIssue' | 'security'
>;

type SiteAnalysisModalProps = {
  analysis: Analysis;
  id: string;
};

export default function SiteAnalysisModal({ analysis }: SiteAnalysisModalProps) {
  const [formLayout] = useState<LayoutType>('vertical');

  const label: Record<keyof Analysis, string> = {
    siteType: 'Site Type',
    security: 'Security',
    seoIssue: 'SEO Issue',
    performance: 'Performance',
    description: 'Description',
    brokenLink: 'Broken Link',
    tech: 'Tech Stack',
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ButtonUI
        text="View analysis"
        variant="outlined"
        onClick={handleOpen}
        icon={<InfoCircleOutlined />}
      />

      <ModalUI
        open={isOpen}
        title="Site Analysis"
        okText="Got it"
        okButtonProps={{ color: 'primary', variant: 'solid', htmlType: 'submit' }}
        cancelButtonProps={{ color: 'primary', variant: 'outlined' }}
        cancelText="Close"
        onCancel={() => setIsOpen(false)}
        onOk={handleClose}
      >
        <Form layout={formLayout}>
          {Object.keys(analysis).map((key) => (
            <Form.Item
              key={key}
              label={label[key as never]}
              labelCol={{
                className: 'font-bold',
              }}
            >
              <span className="text-gray-700 text-base">{analysis[key as never]}</span>
            </Form.Item>
          ))}
        </Form>
      </ModalUI>
    </>
  );
}
