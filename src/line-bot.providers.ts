import * as line from '@line/bot-sdk';
import { Provider } from '@nestjs/common';
import { LineBotModuleOptions } from './interfaces';
import { LINE_MODULE_OPTIONS, LINE_MESSAGING_API_CLIENT } from './line-bot.constants';

export function createLineBotProviders(
  options: LineBotModuleOptions
): Provider[] {
  return [
    {
      provide: LINE_MODULE_OPTIONS,
      useValue: options,
    },
  ];
}

export const LineMessagingApiClientProvider = {
  provide: LINE_MESSAGING_API_CLIENT,
  useFactory: (options: LineBotModuleOptions) => {
    const { channelAccessToken } = options;
    return new line.messagingApi.MessagingApiClient({ channelAccessToken });
  },
  inject: [LINE_MODULE_OPTIONS],
};
