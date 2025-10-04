import { PrismaClient as TypePrismaClient } from '@/app/generated/prisma/client';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { withOptimize } from '@prisma/extension-optimize';
import 'dotenv/config';

neonConfig.webSocketConstructor = ws;

// Guard for development hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

// Function to create a new Prisma client
// function makePrismaClient(): TypePrismaClient {
//   const connectionString = process.env.DATABASE_URL;
//   if (!connectionString) {
//     throw new Error('DATABASE_URL is not defined');
//   }

//   const adapter = new PrismaNeon({ connectionString });
//   return new TypePrismaClient({ adapter });
// }

// Single instance logic
// const basePrisma: PrismaClient =
//   process.env.NODE_ENV !== 'production'
//     ? global.__prismaClient ||
//       (() => {
//         const client = makePrismaClient();
//         global.__prismaClient = client;
//         return client;
//       })()
//     : makePrismaClient();

const basePrisma: TypePrismaClient = PrismaClient;

// Optionally extend with optimize
let prisma;

if (process.env.OPTIMIZE_API_KEY) {
  try {
    prisma = (basePrisma as PrismaClient)?.$extends(
      withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY! })
    );
  } catch (err) {
    console.warn('Failed to apply Prisma Optimize extension:', err);
    prisma = basePrisma;
  }
} else {
  prisma = basePrisma;
}

export default prisma;
export type Prisma = typeof prisma;
