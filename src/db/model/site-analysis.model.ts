import { siteAnalysis as siteAnalysisSchema } from '../schema';
import DB from '../abstract.db';
import { NewSiteAnalysis } from '@/types/model';
import { desc, eq } from 'drizzle-orm';

type SiteAnalysis = Omit<NewSiteAnalysis, 'create_at' | 'id'>;

export default class SiteAnalysisModel extends DB {
  async add(analysis: SiteAnalysis) {
    const result = await this.db
      .insert(siteAnalysisSchema)
      .values(analysis)
      .returning({ insertedId: siteAnalysisSchema.id });

    const { insertedId } = result[0];

    const addedItem = await this.db.query.siteAnalysis.findFirst({
      where: eq(siteAnalysisSchema.id, insertedId),
    });

    return addedItem;
  }

  async getLatestAnalysis(monitorId: string) {
    const analysis = await this.db.query.siteAnalysis.findFirst({
      where: eq(siteAnalysisSchema.monitorId, monitorId),
      orderBy: [desc(siteAnalysisSchema.createdAt)],
    });

    return analysis;
  }

  async deleteByMonitorId(id: string) {
    await this.db.delete(siteAnalysisSchema).where(eq(siteAnalysisSchema.monitorId, id));
  }
}
