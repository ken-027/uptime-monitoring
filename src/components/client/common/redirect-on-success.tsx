/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default function RedirectOnSuccess() {
  const router = useRouter();

  return (
    <>
      <CountdownCircleTimer
        isPlaying
        duration={5}
        // @ts-expect-error @ts
        colors={new Array(5).fill('#4287f5') as string[]}
        // @ts-expect-error @ts
        colorsTime={new Array(5).fill(null).map((_val, index) => ++index)}
        onComplete={() => {
          router.replace('/dashboard');
        }}
      >
        {renderTime}
      </CountdownCircleTimer>
    </>
  );
}

const renderTime = ({ remainingTime }: any) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? 'up' : ''}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div key={prevTime.current} className={`time ${!isTimeUp ? 'down' : ''}`}>
          {prevTime.current}
        </div>
      )}
    </div>
  );
};
