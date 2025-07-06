import { NewMonitorLog } from '@/types/model';
import DB from '../abstract.db';
import { monitorLog } from '../schema';
import { desc, eq } from 'drizzle-orm';
import MonitorModel from './monitor.model';

type MonitorLogType = Omit<NewMonitorLog, 'id'>;

export default class MonitorLogModel extends DB {
  private monitor = new MonitorModel();

  async add(log: MonitorLogType) {
    const result = await this.db
      .insert(monitorLog)
      .values(log)
      .returning({ insertedId: monitorLog.id });

    const { insertedId } = result[0];

    const addedItem = await this.db.query.monitorLog.findFirst({
      where: eq(monitorLog.id, insertedId),
    });

    return addedItem;
  }

  async listByMonitorId(monitorId: string) {
    await this.monitor.getById(monitorId);

    const list = await this.db.query.monitorLog.findMany({
      where: eq(monitorLog.monitorId, monitorId),
      limit: 50,
      orderBy: [desc(monitorLog.checkedAt)],
    });

    return list;
  }

  async deleteByMonitorId(monitorId: string) {
    await this.db.delete(monitorLog).where(eq(monitorLog.monitorId, monitorId));
  }

  async getLastByMonitorId(monitorId: string) {
    await this.monitor.getById(monitorId);

    const lastLog = await this.db.query.monitorLog.findFirst({
      where: eq(monitorLog.monitorId, monitorId),
      orderBy: [desc(monitorLog.checkedAt)],
    });

    return lastLog;
  }
}
