import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JSONParseError, middleware, SignatureValidationFailed, validateSignature } from '@line/bot-sdk';
import { LINE_MODULE_OPTIONS } from '../line-bot.constants';
import { LineBotModuleOptions } from '../interfaces';

@Injectable()
export class LineBotGuard implements CanActivate {
  constructor(
    @Inject(LINE_MODULE_OPTIONS)
    private readonly options: LineBotModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const channelSecret = this.options.channelSecret as string;
    const lineMiddleware = middleware({ channelSecret });

    return new Promise((resolve, reject) => {
      lineMiddleware(request, response, (err: any) => {
        if (err) {
          if (err instanceof SignatureValidationFailed) {
            const body = JSON.stringify(request.body);
            const signature = request.get('X-Line-Signature') as string;
            if (validateSignature(body, channelSecret, signature)) resolve(true);
            else reject(new UnauthorizedException(err.signature));
          } else if (err instanceof JSONParseError) {
            reject(new BadRequestException(err.raw));
          } else {
            reject(err);
          }
        } else {
          resolve(true);
        }
      });
    });
  }
}
