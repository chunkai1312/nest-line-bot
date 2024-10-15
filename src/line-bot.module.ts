import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { LINE_MODULE_OPTIONS } from './line-bot.constants';
import { createLineBotProviders, LineMessagingApiClientProvider } from './line-bot.providers';
import { LineBotModuleOptions, LineBotModuleAsyncOptions, LineBotOptionsFactory } from './interfaces';

@Global()
@Module({})
export class LineBotModule {
  static forRoot(options: LineBotModuleOptions): DynamicModule {
    const providers = [
      ...createLineBotProviders(options),
      LineMessagingApiClientProvider,
    ];
    return {
      module: LineBotModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(options: LineBotModuleAsyncOptions): DynamicModule {
    const providers = [
      ...this.createAsyncProviders(options),
      LineMessagingApiClientProvider,
    ];
    return {
      module: LineBotModule,
      imports: options.imports || [],
      providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: LineBotModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<LineBotOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: LineBotModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: LINE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<LineBotOptionsFactory>,
    ];
    return {
      provide: LINE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: LineBotOptionsFactory) =>
        await optionsFactory.createLineBotOptions(),
      inject,
    };
  }
}
