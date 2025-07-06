import StartedButton from '@/components/client/common/button/started.button';
import { getAuthSession } from '@/lib/auth.lib';
import Image from 'next/image';

export default async function Home() {
  const session = await getAuthSession();

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4 font-anton text-gray-800">
            Reliable Uptime Monitoring Made Simple
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            KSoftDev helps you monitor your websites and APIs in real time. Get alerts, analyze
            downtime with AI, and keep your services online.
          </p>

          <ul className="space-y-2 text-gray-700 mb-8">
            <li>✅ Real-time downtime alerts</li>
            <li>✅ AI-powered analysis on initial and status-change checks</li>
            <li>✅ Flexible monitoring intervals: hourly, 6h, 12h, or daily</li>
            <li>✅ Email and webhook-based alerting</li>
            <li>✅ Simulated payment system for testing workflows</li>
          </ul>

          {!session.session ? <StartedButton /> : null}
        </div>

        <div className="w-full">
          <Image
            src="/illustration/monitoring.svg"
            alt="Monitoring Illustration"
            width={600}
            height={400}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
