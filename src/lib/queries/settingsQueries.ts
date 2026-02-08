// src/lib/queries/settingsQueries.ts
import db from "@/lib/prisma";

export async function getSystemSettings() {
  const settings = await db.setting.findMany();
  // Return as an object for easy access
  return settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value as string;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export async function updateSystemSetting(key: string, value: string) {
  return await db.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function bulkUpdateSettings(settings: Record<string, string>) {
  const operations = Object.entries(settings).map(([key, value]) =>
    db.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    }),
  );
  return await db.$transaction(operations);
}
