import { X_SECRET_KEY } from '@/config/env.config';
import MonitorModel from '@/db/model/monitor.model';
import UserModel from '@/db/model/user.model';
import { AppStatus } from '@/enum/app.enum';
import { withErrorWrapper } from '@/errors/error-wrapper.error';
import { UnAuthorizedError } from '@/errors/unauthorized.error';
import WebChecker from '@/lib/monitor.lib';
import EmailJS from '@/util/email-js';
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

  if (analysis.status === AppStatus.DOWN) {
    const userModel = new UserModel();
    const monitorModel = new MonitorModel();

    const monitor = await monitorModel.getById(monitorId);
    const user = await userModel.getById(monitor.userId);

    const email = new EmailJS(user.email);
    email.setMessage(
      `Your monitor with ID: ${monitorId} and Name: ${monitor.name} is down. Please check the status of your monitor.\n\nAnalysis: ${analysis.description}`,
    );
    email.send();
  }

  return NextResponse.json({
    status: 'done',
    analysis,
  });
});
