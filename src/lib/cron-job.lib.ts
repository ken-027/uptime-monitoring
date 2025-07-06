import { QSTASH_TOKEN, X_SECRET_KEY } from '@/config/env.config';
import MonitorLogModel from '@/db/model/monitor-log.model';
import MonitorModel from '@/db/model/monitor.model';
import { AppStatus, HourlyPlan } from '@/enum/app.enum';
import { Client } from '@upstash/qstash';
import moment from 'moment';

export default class CronJob {
  private monitorModel;
  private cronClient;

  constructor(private monitorId: string) {
    this.monitorModel = new MonitorModel();
    this.cronClient = new Client({ token: QSTASH_TOKEN });
  }

  async addToCron() {
    const monitor = await this.monitorModel.getById(this.monitorId);

    let hours: string;
    const currentHour = moment().hours();
    const currentMinutes = moment().minutes();

    if (monitor.interval === HourlyPlan.DAILY) {
      hours = `${currentHour}`;
    } else {
      hours = monitor.interval > 1 ? `*/${monitor.interval}` : '*';
    }

    const cronExpires = `${currentMinutes} ${hours} * * *`;
    // const cronExpires = `* * * * *`;

    await this.cronClient.schedules.create({
      scheduleId: `ping-monitor-${monitor.id}`,
      destination: `https://uptime-monitoring.ksoftdev.site/api/v1/ping/${monitor.id}`,
      cron: cronExpires,
      headers: {
        'x-monitor-secret': X_SECRET_KEY,
      },
    });
  }

  async remove() {
    await this.cronClient.schedules.delete(`ping-monitor-${this.monitorId}`);
  }

  async pause() {
    await this.monitorModel.getById(this.monitorId);

    this.monitorModel.updateStatus(this.monitorId, AppStatus.PAUSE);

    await this.cronClient.schedules.pause({ schedule: `ping-monitor-${this.monitorId}` });
  }

  async resume() {
    await this.monitorModel.getById(this.monitorId);
    const monitorLog = new MonitorLogModel();
    const lastLog = await monitorLog.getLastByMonitorId(this.monitorId);

    this.monitorModel.updateStatus(this.monitorId, lastLog?.status || AppStatus.UNKNOWN);

    await this.cronClient.schedules.resume({ schedule: `ping-monitor-${this.monitorId}` });
  }
}
