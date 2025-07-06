'use client';

import ButtonCommon from '../../ui/button.ui';
import { resumeItem } from '@/app/actions/monitor.action';
import { PlayCircleFilled } from '@ant-design/icons';
import { useTransition } from 'react';

interface ResumeButtonProps {
  id: string;
}

export default function ResumeButton({ id }: ResumeButtonProps) {
  const resumeJob = resumeItem.bind(null, id);
  const [pending, startTransition] = useTransition();

  const onResume = () =>
    startTransition(async () => {
      await resumeJob();
    });

  return (
    <ButtonCommon loading={pending} text="Resume" icon={<PlayCircleFilled />} onClick={onResume} />
  );
}
