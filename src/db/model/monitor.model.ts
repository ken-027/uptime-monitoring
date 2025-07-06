import DB from '../abstract.db';
import { Monitor, NewMonitor } from '@/types/model';
import { monitor as monitorSchema } from '../schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { NotFoundError } from '@/errors/not-found.error';
import { BadRequestError } from '@/errors/bad-request.error';
import { AppStatus } from '@/enum/app.enum';
import MonitorLogModel from './monitor-log.model';
import SiteAnalysisModel from './site-analysis.model';

type MonitorType = Required<Pick<NewMonitor, 'name' | 'url' | 'interval' | 'userId'>>;

export default class MonitorModel extends DB {
  async add(monitor: MonitorType) {
    const result = await this.db
      .insert(monitorSchema)
      .values(monitor)
      .returning({ insertedId: monitorSchema.id });

    const { insertedId } = result[0];

    const addedItem = await this.db
      .select()
      .from(monitorSchema)
      .where(eq(monitorSchema.id, insertedId));

    return addedItem[0] as Monitor;
  }

  async updateStatus(id: string, status: AppStatus) {
    await this.getById(id);

    await this.db
      .update(monitorSchema)
      .set({
        lastStatus: status,
        updatedAt: sql`NOW()`,
      })
      .where(eq(monitorSchema.id, id));
  }

  async list() {
    const result = await this.db.select().from(monitorSchema);

    return result;
  }

  async listByUser(userId: string) {
    const result = await this.db.query.monitor.findMany({
      where: eq(monitorSchema.userId, userId),
      orderBy: [desc(monitorSchema.createdAt)],
    });

    return result;
  }

  async checkUrl(url: string, userId: string): Promise<void> {
    const exists = await this.db
      .select()
      .from(monitorSchema)
      .where(and(eq(monitorSchema.userId, userId), eq(monitorSchema.url, url)));

    if (exists.length > 0) throw new BadRequestError('url exists!');
  }

  async getTotalByUser(userId: string) {
    const total = await this.db.$count(monitorSchema, eq(monitorSchema.userId, userId));

    return total;
  }

  async getById(id: string) {
    const result = await this.db.query.monitor.findFirst({
      where: eq(monitorSchema.id, id),
    });

    if (!result) throw new NotFoundError('monitor id not found!');

    return result;
  }

  async deleteItem(id: string) {
    const siteAnalysis = new SiteAnalysisModel();
    const monitor = await this.getById(id);

    if (monitor.lastStatus !== AppStatus.PAUSE)
      throw new BadRequestError('cannot delete a monitor that is running!');

    const log = new MonitorLogModel();

    await siteAnalysis.deleteByMonitorId(id);
    await log.deleteByMonitorId(id);
    await this.db.delete(monitorSchema).where(eq(monitorSchema.id, id));
  }
}
