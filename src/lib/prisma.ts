import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "@/app/generated/prisma/client";
import { DATABASE_URL } from "./constants";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

// Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const getPrisma = () => prisma;
export { prisma };
export default prisma;
