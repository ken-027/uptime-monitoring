import { X_SECRET_KEY } from '@/config/env.config';
import { withErrorWrapper } from '@/errors/error-wrapper.error';
import { UnAuthorizedError } from '@/errors/unauthorized.error';
import WebChecker from '@/lib/web-checker.lib';
import { NextRequest, NextResponse } from 'next/server';

interface SearchParams {
  params: Promise<{
    monitorId: string;
  }>;
}

export const POST = withErrorWrapper(async (request: NextRequest, { params }: SearchParams) => {
  const xMonitorSecret = request.headers.get('x-monitor-secret');

  if (xMonitorSecret?.trim() !== X_SECRET_KEY)
    throw new UnAuthorizedError('invalid token for "x-monitor-secret" header');

  const monitorId = (await params).monitorId;

  const webChecker = new WebChecker(monitorId);

  const analysis = await webChecker.checkStatus();

  return NextResponse.json({
    status: 'done',
    analysis,
  });
});
