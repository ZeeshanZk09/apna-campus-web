import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('db', 'migrations'),
  },
});

//  path.join('db', 'formatting-migrations') ||

//  path.join('prisma', 'schema.tmp.prisma') ||
