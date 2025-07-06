import { auth } from '@/lib/auth.lib';
import UptimeMonitoringMCP from '@/mcp-servers/uptime-monitoring.mcp';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { withMcpAuth } from 'better-auth/plugins';

const handler = withMcpAuth(auth, (req, session) => {
  const userId = session.userId;

  return createMcpHandler(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (server: any) => {
      const uptimeMonitor = new UptimeMonitoringMCP(server, userId);

      uptimeMonitor.addMonitor();
      uptimeMonitor.monitorList();
      uptimeMonitor.pauseMonitor();
      uptimeMonitor.removeMonitor();
      uptimeMonitor.getAnalysis();
      uptimeMonitor.getMonitorLogs();
    },
    {
      capabilities: {
        tools: {
          addMonitor: { description: 'Start a monitor for a user service' },
          monitorList: { description: 'List all active monitors' },
          pauseMonitor: { description: 'Pause an existing monitor' },
          removeMonitor: { description: 'Remove a user monitor' },
          getAnalysis: { description: 'Get analysis results for a monitor' },
          getMonitorLogs: { description: 'Retrieve logs of a monitor run' },
        },
      },
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
