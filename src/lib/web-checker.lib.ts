import { AGENTIC_API } from '@/config/env.config';
import MonitorLogModel from '@/db/model/monitor-log.model';
import MonitorModel from '@/db/model/monitor.model';
import SiteAnalysisModel from '@/db/model/site-analysis.model';
import SubscriptionModel from '@/db/model/subscription.model';
import UserModel from '@/db/model/user.model';
import { AppStatus, SubscriptionPlan } from '@/enum/app.enum';
import { AgentResponse } from '@/types/app';
import { Monitor, SiteAnalysis } from '@/types/model';
import PushoverNotificationUtil from '@/util/pushover-notification.util';
import axios from 'axios';
import moment from 'moment';
import EmailJS from '@/util/email-js';

export default class WebChecker {
  private monitorModel;
  private monitorLogModel;
  private subscriptionModel;
  private userModel;

  constructor(private monitorId: string) {
    this.monitorModel = new MonitorModel();
    this.monitorLogModel = new MonitorLogModel();
    this.subscriptionModel = new SubscriptionModel();
    this.userModel = new UserModel();
  }

  private pushNotification(monitor: Monitor, format: AgentResponse) {
    const pushNotification = new PushoverNotificationUtil();
    pushNotification.job(monitor, {
      status: format.status,
      responseTime: format.responseTime,
      description: format.description,
    });
  }

  private async insertMonitorLog(monitor: Monitor, format: AgentResponse) {
    const monitorLog = new MonitorLogModel();

    await monitorLog.add({
      status: format.status as never,
      responseTime: format.responseTime,
      monitorId: monitor.id,
    });
  }

  private async insertAnalysis(analysis: Omit<SiteAnalysis, 'createdAt' | 'id'>) {
    const siteAnalysis = new SiteAnalysisModel();

    await siteAnalysis.add(analysis);
  }

  private async isInWeekAnalyze(): Promise<boolean> {
    const siteAnalysis = new SiteAnalysisModel();

    const lastAnalysis = await siteAnalysis.getLatestAnalysis(this.monitorId);

    if (!lastAnalysis) return false;

    console.log(lastAnalysis.createdAt);

    const days = moment().diff(moment(lastAnalysis.createdAt), 'days');

    console.log({ days });
    return days >= 7;
  }

  private async updateStatus(status: AppStatus) {
    const monitor = new MonitorModel();

    await monitor.updateStatus(this.monitorId, status);
  }

  private async pushEmail(analysis: string) {
    const monitor = await this.monitorModel.getById(this.monitorId);
    const user = await this.userModel.getById(monitor.userId);

    const email = new EmailJS(user.email);
    email.setMessage(
      `Your monitor with ID: ${this.monitorId} and Name: ${monitor.name} is down. Please check the status of your monitor.\n\nAnalysis: ${analysis}`,
    );
    await email.send();
  }

  async checkStatus() {
    const monitor = await this.monitorModel.getById(this.monitorId);

    const monitorLog = await this.monitorLogModel.getLastByMonitorId(this.monitorId);

    const lastStatus = monitorLog?.status;

    let format: AgentResponse = {
      status: AppStatus.DOWN,
      responseTime: 0,
      description: '',
      siteType: '',
      techs: [],
      seoIssue: '',
      brokenLink: '',
      performance: '',
      security: '',
    };

    const start = new Date().getTime();
    try {
      const res = await axios.get(monitor.url);

      if (res.status !== 200) throw new Error('Something went wrong with the site');
      format.status = AppStatus.UP;
    } catch (err) {
      console.log(err);
    }

    const end = new Date().getTime() - start;

    const plan = await this.subscriptionModel.getPlan(monitor.userId);

    format.responseTime = end;

    const enterprisePlan = plan === SubscriptionPlan.ENTERPRISE && (await this.isInWeekAnalyze());

    try {
      if (lastStatus !== format.status || enterprisePlan) {
        const res = await axios.post(AGENTIC_API, {
          url: monitor.url,
        });

        format = res.data as AgentResponse;
        const {
          siteType,
          techs,
          seoIssue,
          brokenLink,
          performance,
          security,
          status,
          description,
        } = format;

        await this.insertAnalysis({
          siteType,
          monitorId: monitor.id,
          tech: techs.join(', '),
          seoIssue,
          brokenLink,
          performance,
          security,
          status,
          description,
        });

        if (format.status === AppStatus.DOWN) {
          await this.pushEmail(format.description);
        }
      }
    } catch (err) {
      console.log(err);
    }

    this.pushNotification(monitor, format);
    this.insertMonitorLog(monitor, format);
    this.updateStatus(format.status);

    return format;
  }
}
