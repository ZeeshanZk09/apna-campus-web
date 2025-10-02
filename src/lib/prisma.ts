import { PrismaClient } from '@/app/generated/prisma/client';
// import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { withOptimize } from '@prisma/extension-optimize';
// import {
//   GlobalOmitConfig,
//   TypeMap,
//   TypeMapCb,
// } from '@/app/generated/prisma/client/internal/prismaNamespace';
import { DynamicClientExtensionThis, InternalArgs } from '@prisma/client/runtime/client';
import {
  GlobalOmitConfig,
  TypeMap,
  TypeMapCb,
} from '@/app/generated/prisma/internal/prismaNamespace';

// Set WebSocket constructor for Neon (required for serverless)
neonConfig.webSocketConstructor = ws;

// Optional: For Edge runtimes (e.g., Vercel Edge, Cloudflare Workers)
// neonConfig.poolQueryViaFetch = true;

function createBasePrisma(): PrismaClient {
  console.log('Initializing PrismaClient with Neon driver adapter...');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }

  const adapter = new PrismaNeon({ connectionString }); // Use 'url' as per adapter constructor
  const client = new PrismaClient({ adapter });
  console.log('PrismaClient initialized successfully with adapter.');
  return client;
}

// Instantiate basePrisma (typed as PrismaClient)
const basePrisma = createBasePrisma();

// Optionally extend only in non-production (Optimize is for dev only)
// const prisma = basePrisma;
export type PrismaType =
  | PrismaClient
  | DynamicClientExtensionThis<
      TypeMap<
        InternalArgs & {
          result: {};
          model: {};
          query: {};
          client: {};
        },
        GlobalOmitConfig | undefined
      >,
      TypeMapCb<GlobalOmitConfig | undefined>,
      {
        result: {};
        model: {};
        query: {};
        client: {};
      }
    >;
let prisma: PrismaType;
try {
  prisma =
    process.env.NODE_ENV !== 'production' && process.env.OPTIMIZE_API_KEY!
      ? basePrisma.$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY! }))
      : basePrisma;
} catch (error) {
  prisma = basePrisma;
  console.log(error);
}

// Dev hot-reload guard
declare global {
  // eslint-disable-next-line no-var
  var __prisma: typeof prisma;
}

if (process.env.NODE_ENV !== 'production') {
  if (!global.__prisma) {
    global.__prisma = prisma as PrismaType;
  }
}

const db = process.env.NODE_ENV === 'production' ? (prisma as PrismaType) : global.__prisma;

export default db;
export type Prisma = typeof db;
