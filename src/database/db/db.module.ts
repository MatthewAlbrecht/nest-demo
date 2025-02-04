import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './db.schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema });

@Global()
@Module({
  providers: [{ provide: 'DB', useValue: db }],
  exports: ['DB'],
})
export class DbModule {}
