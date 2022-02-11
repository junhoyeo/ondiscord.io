import { isBrowser } from '@/utils/browser';
import { Config } from '@/utils/Config';

import { AnalyticsEvent } from './events';

export async function getAmplitude() {
  if (isBrowser) {
    const amplitude = await import('amplitude-js');
    return amplitude.default.getInstance();
  }
  return undefined;
}

export async function initialize() {
  const amplitude = await getAmplitude();
  amplitude?.init(Config.AMPLITUDE_API_KEY);
  amplitude?.setUserProperties({
    is_debug: Config.ENVIRONMENT !== 'production',
  });
}

export async function logEvent<TName extends keyof AnalyticsEvent>(
  name: TName,
  properties: AnalyticsEvent[TName],
) {
  const eventProperties = {
    referrer: document.referrer || undefined,
    ...(properties as unknown as object),
  };
  if (Config.ENVIRONMENT !== 'production') {
    console.log('[Analytics]', name, eventProperties);
  }
  const amplitude = await getAmplitude();
  amplitude?.logEvent(name, eventProperties);
}
