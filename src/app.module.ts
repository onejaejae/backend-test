import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { HttpAdapterHost } from '@nestjs/core';
import { Server } from 'node:http';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}

  onApplicationBootstrap() {
    const server: Server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 91 * 1000;
    server.headersTimeout = 95 * 1000;
  }
}
