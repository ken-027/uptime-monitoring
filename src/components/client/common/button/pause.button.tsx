'use client';

import ButtonCommon from '../../ui/button.ui';
import { pauseItem } from '@/app/actions/monitor.action';
import { PauseCircleFilled } from '@ant-design/icons';
import { useTransition } from 'react';

interface PauseButtonProps {
  id: string;
}

export default function PauseButton({ id }: PauseButtonProps) {
  const pauseJob = pauseItem.bind(null, id);
  const [pending, startTransition] = useTransition();

  const onPause = () =>
    startTransition(async () => {
      await pauseJob();
    });

  return (
    <ButtonCommon text="Pause" loading={pending} icon={<PauseCircleFilled />} onClick={onPause} />
  );
}
