import { Pool } from 'pg';
import { DB_URL } from './env.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema';

export const pool = new Pool({
  connectionString: DB_URL,
  // ssl: {
  //     rejectUnauthorized: false,
  // },
});

const db = drizzle({
  client: pool,
  schema: { ...schema },
  // logger: {
  //   logQuery: (query, params) => {
  //     console.log('🗄️ SQL Query:', query);
  //     console.log('📝 Params:', params);
  //   },
  // },
});

export default db;
