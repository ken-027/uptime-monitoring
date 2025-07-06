// @ts-expect-error @ts-ignore
import Push from 'pushover-notifications';
import { PUSHOVER_TOKEN, PUSHOVER_USER } from '@/config/env.config';
import { Monitor } from '@/types/model';
import { AppStatus } from '@/enum/app.enum';

export default class PushoverNotificationUtil {
  private pushover: Push;

  constructor() {
    this.pushover = new Push({
      user: PUSHOVER_USER,
      token: PUSHOVER_TOKEN,
      // httpOptions: {
      //     proxy: HTTP_PROXY,
      // },
      // onerror: function(error) {},
      // update_sounds: true // update the list of sounds every day - will
      // prevent app from exiting.
    });
  }

  job(
    monitor: Monitor,
    site: {
      status: AppStatus;
      responseTime: number;
      description: string;
    },
  ) {
    const msg = {
      message: `Name: ${monitor.name}\nID: ${monitor.id}\nURL: ${monitor.url}\nStatus: ${site.status}\nResponse Time: ${site.responseTime}\nAnalysis: ${site.description}`,
      title: 'Job Run',
      sound: 'magic',
      priority: 0,
    };

    this.pushover.send(msg, (err: unknown, result: unknown) => {
      if (err) {
        throw err;
      }
      console.log(result);
    });
  }
}
