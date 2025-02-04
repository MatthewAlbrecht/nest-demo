import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/db/db.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
} satisfies Config;
