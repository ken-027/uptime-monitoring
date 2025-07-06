import MonitorModel from '@/db/model/monitor.model';
import SubscriptionModel from '@/db/model/subscription.model';
import { auth } from '@/lib/auth.lib';
import CronJob from '@/lib/cron-job.lib';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { withMcpAuth } from 'better-auth/plugins';
import z from 'zod';

const handler = withMcpAuth(auth, (req, session) => {
  const userId = session.userId;

  return createMcpHandler(
    async (server) => {
      server.tool('monitor_list', 'user list of url to monitor', {}, async () => {
        const monitor = new MonitorModel();
        const list = await monitor.listByUser(userId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                list.map(
                  ({ id, interval, name, url }) =>
                    `ID: ${id}\nInterval in hours: ${interval}\nName: ${name}\nURL: ${url}`,
                ),
              ),
            },
          ],
        };
      });

      server.tool(
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

          await subscription.validatePlan(userId, interval);

          await monitor.checkUrl(url, userId);
          const addedMonitor = await monitor.add({
            name,
            url,
            interval,
            userId: userId,
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

      server.tool(
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
                text: 'Successfully deleted',
              },
            ],
          };
        },
      );

      server.tool(
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
    },
    {
      // capabilities: {
      //   tools: {
      //     echo: {
      //       description: "Echo a message",
      //     },
      //   },
      // },
    },
    {
      redisUrl: process.env.REDIS_URL,
      basePath: '/api/v1',
      verboseLogs: true,
      maxDuration: 60,
    },
  )(req);
});

export { handler as GET, handler as POST, handler as DELETE };
