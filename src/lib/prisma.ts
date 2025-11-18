// src/lib/prisma.ts
import { PrismaClient as TypePrismaClient } from '@/app/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { withOptimize } from '@prisma/extension-optimize';
import 'dotenv/config';

neonConfig.webSocketConstructor = ws;

declare global {
  var __prismaClient: TypePrismaClient | undefined;
  var __prismaSingleton: TypePrismaClient | undefined;
}

function makePrismaClient(): TypePrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  const adapter = new PrismaNeon({ connectionString });
  return new TypePrismaClient({ adapter });
}

let _prisma: TypePrismaClient | undefined;

export function getPrisma(): TypePrismaClient {
  if (_prisma) return _prisma;

  // server-only guard
  const isServer = typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge';
  const basePrisma =
    process.env.NODE_ENV !== 'production'
      ? global.__prismaClient ||
        (() => {
          const c = makePrismaClient();
          global.__prismaClient = c;
          return c;
        })()
      : makePrismaClient();

  console.log(isServer, process.env.OPTIMIZE_API_KEY, process.env.DATABASE_URL);

  if (isServer && process.env.OPTIMIZE_API_KEY && process.env.DATABASE_URL) {
    try {
      _prisma = basePrisma.$extends(
        withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
      ) as TypePrismaClient;
    } catch (err) {
      console.warn('Failed to apply Prisma Optimize extension:', err);
      _prisma = basePrisma;
    }
  } else {
    if (!isServer) console.warn('⚠️ Prisma: non-server runtime — skipping extensions');
    if (!process.env.DATABASE_URL) console.warn('⚠️ DATABASE_URL missing — skipping Optimize');
    _prisma = basePrisma;
  }

  return _prisma;
}

export type Prisma = typeof TypePrismaClient;
