import DeleteUptimeButton from '@/components/client/common/button/delete-uptime.button';
import LineChart from '@/components/client/common/charts/line.chart';
import MonitorLogModel from '@/db/model/monitor-log.model';
import { getAuthenticatedSession } from '@/lib/auth.lib';
import { hourChart } from '@/util/date.util';
import { AppStatus, SubscriptionPlan, TotalPlan } from '@/enum/app.enum';
import ResumeButton from '@/components/client/common/button/resume.button';
import PauseButton from '@/components/client/common/button/pause.button';
import { InfoCircleOutlined, LinkOutlined } from '@ant-design/icons';
import AddMonitorModal from '@/components/client/common/modal/add-monitor.modal';
import { ADMIN_EMAIL, APP_NAME } from '@/config/env.config';
import { Metadata } from 'next';
import SubscriptionModel from '@/db/model/subscription.model';
import SiteAnalysisModel from '@/db/model/site-analysis.model';
import MonitorModel from '@/db/model/monitor.model';
import { Monitor } from '@/types/model';
import SiteAnalysisModal from '@/components/client/common/modal/anaylsis.modal';
import ButtonUI from '@/components/client/ui/button.ui';
import { Space, Tooltip } from 'antd';

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
  description: "dashboard that show's analytics of websites",
};

export default async function Dashboard() {
  const { user } = await getAuthenticatedSession();

  const monitor = new MonitorModel();
  const subscription = new SubscriptionModel();

  const list = await monitor.listByUser(user.id);
  const plan = await subscription.getPlan(user.id);

  const enterprisePlan =
    plan === SubscriptionPlan.ENTERPRISE && TotalPlan.ENTERPRISE >= list.length;
  const proPlan = plan === SubscriptionPlan.PRO && TotalPlan.PRO >= list.length;
  const freePlan = plan === SubscriptionPlan.FREE && TotalPlan.FREE >= list.length;
  const adminPlan = user.email === ADMIN_EMAIL;

  return (
    <Space direction="vertical">
      <h2 className="font-anton text-center text-2xl">Active Monitors</h2>
      <div className="flex justify-between">
        <div className="w-full lg:grid-cols-2 2xl:grid-cols-3 grid gap-10">
          {list.map((item) => (
            <MonitorItem key={item.id} {...item} />
          ))}

          {adminPlan || enterprisePlan || proPlan || freePlan ? <AddMonitorModal /> : null}
        </div>
      </div>
    </Space>
  );
}

const Logs = async ({ id, interval }: { id: string; interval: number }) => {
  const log = new MonitorLogModel();
  const logs = await log.listByMonitorId(id);

  const lastStatus = logs.length > 0 ? (logs[0].status as AppStatus) : AppStatus.UNKNOWN;

  return (
    <div className="w-full my-5">
      <LineChart
        lastStatus={lastStatus}
        interval={interval}
        data={logs.map((log) => ({
          time: hourChart(log.checkedAt),
          responseTime: log.responseTime,
          status: log.status as AppStatus,
        }))}
      />
    </div>
  );
};

async function MonitorItem({ id, name, interval, lastStatus, url }: Monitor) {
  const siteAnalysis = new SiteAnalysisModel();
  const analysis = await siteAnalysis.getLatestAnalysis(id);

  return (
    <div className="hover:bg-gray-50 rounded-md hover:shadow-lg shadow p-4 transition-all duration-300">
      <div className="space-y-2">
        <h3 className="font-bold text-2xl">{name}</h3>
        <a target="_blank" className="text-blue-500 block" href={url}>
          <LinkOutlined /> {url}
        </a>
        <p>
          Status: <strong className="uppercase">{lastStatus}</strong>
        </p>
        {analysis ? (
          <SiteAnalysisModal
            analysis={{
              siteType: analysis.siteType,
              performance: analysis.performance,
              security: analysis.security,
              seoIssue: analysis.seoIssue,
              brokenLink: analysis.brokenLink,
              tech: analysis.tech,
              description: analysis.description,
            }}
            id={id}
          />
        ) : (
          <>
            <Tooltip title="Analysis will be available once the job starts">
              <ButtonUI text="View analysis" variant="outlined" icon={<InfoCircleOutlined />} />
            </Tooltip>
          </>
        )}
      </div>

      <Logs id={id} interval={interval} />
      {lastStatus === AppStatus.PAUSE ? (
        <div className="space-x-2 mt-2">
          <ResumeButton id={id} />
          <DeleteUptimeButton id={id} />
        </div>
      ) : (
        <PauseButton id={id} />
      )}
    </div>
  );
}
