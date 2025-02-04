import { Global, Module } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

config({ path: '.env' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

@Global()
@Module({
  providers: [{ provide: 'REDIS', useValue: redis }],
  exports: ['REDIS'],
})
export class RedisModule {}
