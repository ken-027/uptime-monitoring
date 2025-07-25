import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/db/schema/*.schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});
