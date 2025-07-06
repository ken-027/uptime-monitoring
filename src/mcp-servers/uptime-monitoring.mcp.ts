import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import MonitorModel from '@/db/model/monitor.model';
import SubscriptionModel from '@/db/model/subscription.model';
import CronJob from '@/lib/cron-job.lib';
import z from 'zod';
import MonitorLogModel from '@/db/model/monitor-log.model';
import SiteAnalysisModel from '@/db/model/site-analysis.model';

export default class UptimeMonitoringMCP {
  private server: McpServer;
  private userId: string;
  private monitorModel: MonitorModel;

  constructor(server: McpServer, userId: string) {
    this.server = server;
    this.userId = userId;
    this.monitorModel = new MonitorModel();
  }

  monitorList() {
    this.server.tool('monitor_list', 'user list of url to monitor', {}, async () => {
      const list = await this.monitorModel.listByUser(this.userId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(list.map((item) => JSON.stringify(item))),
          },
        ],
      };
    });
  }

  addMonitor() {
    this.server.tool(
      'add_monitor',
      'user add monitor',
      {
        name: z.string().min(3, 'Name must be at least 3 characters'),
        url: z.string().url('Must be a valid URL'),
        interval: z.enum(['2', '6', '12', '24']).transform(Number),
      },
      async ({ name, url, interval }) => {
        const monitor = new MonitorModel();
        const subscription = new SubscriptionModel();

        await subscription.validatePlan(this.userId, interval);

        await monitor.checkUrl(url, this.userId);
        const addedMonitor = await monitor.add({
          name,
          url,
          interval,
          userId: this.userId,
        });

        const cronJob = new CronJob(addedMonitor.id);
        await cronJob.addToCron();

        return {
          content: [
            {
              type: 'text',
              text: 'Successfully add',
            },
          ],
        };
      },
    );
  }

  pauseMonitor() {
    this.server.tool(
      'pause_monitor',
      'pause a monitor that is running',
      {
        id: z.string().trim(),
      },
      async ({ id }) => {
        const cronJob = new CronJob(id);

        await cronJob.pause();

        return {
          content: [
            {
              type: 'text',
              text: 'Successfully pause',
            },
          ],
        };
      },
    );
  }

  removeMonitor() {
    this.server.tool(
      'remove_monitor',
      'remove a monitor by id',
      {
        id: z.string().trim(),
      },
      async ({ id }) => {
        const monitor = new MonitorModel();
        const cronJob = new CronJob(id);

        await monitor.deleteItem(id);
        await cronJob.remove();

        return {
          content: [
            {
              type: 'text',
              text: 'Successfully deleted',
            },
          ],
        };
      },
    );
  }

  getMonitorLogs() {
    this.server.tool(
      'monitor_logs',
      'monitor list logs by monitor id please compute this as average response time of the logs',
      {
        id: z.string().trim(),
      },
      async ({ id }) => {
        const log = new MonitorLogModel();
        const logs = await log.listByMonitorId(id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(logs),
            },
          ],
        };
      },
    );
  }

  getAnalysis() {
    this.server.tool(
      'monitor_analysis',
      'get monitor analysis',
      {
        id: z.string().trim(),
      },
      async ({ id }) => {
        const analysisModel = new SiteAnalysisModel();
        const analysis = await analysisModel.getAnalysisList(id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(analysis),
            },
          ],
        };
      },
    );
  }
}
