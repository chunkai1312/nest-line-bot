# nest-line-bot

[![NPM version][npm-image]][npm-url]

> LINE Bot module for Nest

## Installation

To begin using it, we first install the required dependencies.

```bash
$ npm install --save nest-line-bot @line/bot-sdk
```

## Getting started

Once the installation is complete, import the `LineBotModule` into the root `AppModule` and run the `forRoot()` static method as shown below:

```typescript
import { Module } from '@nestjs/common';
import { LineBotModule } from 'nest-line-bot';

@Module({
  imports: [
    LineBotModule.forRoot({
      channelAccessToken: 'LINE_CHANNEL_ACCESS_TOKEN',
      channelSecret: 'LINE_CHANNEL_SECRET',
    }),
  ],
})
export class AppModule {}
```

Next, inject the `line.messagingApi.MessagingApiClient` instance using the `@InjectLineMessagingApiClient()` decorator.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectLineMessagingApiClient } from 'nest-line-bot';
import * as line from '@line/bot-sdk';

@Injectable()
export class AppService {
  constructor(
    @InjectLineMessagingApiClient() private readonly client: line.messagingApi.MessagingApiClient,
  ) {}

  async pushMessage() {
    await this.client.pushMessage({
      to: 'LINE_USER_ID',
      messages: [{ type: 'text', text: 'hello, world' }]
    });
  }
}
```

## Webhook

The LINE Platform sends an HTTP POST request with a webhook event object to the webhook URL (bot server) you register in the LINE Developers Console.

This module offers a decorator to help you easily build a webhook server. By using the `@OnWebhookEvent()` decorator in your controller, you can define an endpoint to receive webhook events.

```typescript
import { OnWebhookEvent } from '@fugletrader/core';
import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class NotifierController {
  @Post('/webhook')
  @OnWebhookEvent()
  async webhook(@Body() body) {
    return body.events;
  }
}
```

## Async configuration

When you need to pass module options asynchronously instead of statically, use the `forRootAsync()` method. As with most dynamic modules, Nest provides several techniques to deal with async configuration.

One technique is to use a factory function:

```typescript
LineBotModule.forRootAsync({
  useFactory: () => ({
    channelAccessToken: 'LINE_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'LINE_CHANNEL_SECRET',
  }),
});
```

Like other factory providers, our factory function can be [async](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) and can inject dependencies through `inject`.

```typescript
LineBotModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    channelAccessToken: configService.get('LINE_CHANNEL_ACCESS_TOKEN'),
    channelSecret: configService.get('LINE_CHANNEL_SECRET'),
  }),
  inject: [ConfigService],
});
```

Alternatively, you can configure the `LineBotModule` using a class instead of a factory, as shown below.

```typescript
LineBotModule.forRootAsync({
  useClass: LineBotConfigService,
});
```

The construction above instantiates `LineBotConfigService` inside `LineBotModule`, using it to create an options object. Note that in this example, the `LineBotConfigService` has to implement `LineBotOptionsFactory` interface as shown below. The `LineBotModule` will call the `createLineBotOptions()` method on the instantiated object of the supplied class.

```typescript
@Injectable()
class LineBotConfigService implements LineBotOptionsFactory {
  createLineBotOptions(): LineBotModuleOptions {
    return {
      channelAccessToken: 'LINE_CHANNEL_ACCESS_TOKEN',
      channelSecret: 'LINE_CHANNEL_SECRET',
    };
  }
}
```

If you want to reuse an existing options provider instead of creating a private copy inside the `LineBotModule`, use the `useExisting` syntax.

```typescript
LineBotModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: LineBotConfigService,
});
```

## References

- [LINE Developers Console](https://developers.line.biz/en/services/messaging-api/)
- [LINE Messaging API SDK for nodejs](https://line.github.io/line-bot-sdk-nodejs/)

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/nest-line-bot.svg
[npm-url]: https://npmjs.com/package/nest-line-bot
