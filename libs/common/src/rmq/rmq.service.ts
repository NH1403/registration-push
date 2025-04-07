import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(
    queue: string,
    noAck = false,
    delayMs = 0,
    queueToSendAfterDelay = '',
  ): RmqOptions {
    const baseOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')!],
        queue,
        noAck,
        persistent: true,
      },
    };

    if (delayMs > 0) {
      baseOptions.options!.queueOptions = {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': queueToSendAfterDelay,
          'x-message-ttl': delayMs,
        },
      };
    }

    return baseOptions;
  }
}
