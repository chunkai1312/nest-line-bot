import { Inject, UseGuards } from '@nestjs/common';
import { LineBotGuard } from '../guards';
import { LINE_MESSAGING_API_CLIENT } from '../line-bot.constants';

export const InjectLineMessagingApiClient = (): ParameterDecorator => {
  return Inject(LINE_MESSAGING_API_CLIENT);
};

export const OnWebhookEvent = (): ClassDecorator & MethodDecorator => {
  return UseGuards(LineBotGuard);
}
