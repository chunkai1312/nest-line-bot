import { ModuleMetadata, Type } from '@nestjs/common';

export interface LineBotModuleOptions {
  channelAccessToken: string;
  channelSecret?: string;
}

export interface LineBotOptionsFactory {
  createLineBotOptions(): Promise<LineBotModuleOptions> | LineBotModuleOptions;
}

export interface LineBotModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<LineBotOptionsFactory>;
  useClass?: Type<LineBotOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<LineBotModuleOptions> | LineBotModuleOptions;
  inject?: any[];
}
