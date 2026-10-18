import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Gift } from "./templates";
const folder = path.join(process.cwd(), ".data", "gifts");
export async function saveGift(gift: Gift) {
  await fs.mkdir(folder, { recursive: true });
  const id = randomUUID();
  await fs.writeFile(path.join(folder, `${id}.json`), JSON.stringify(gift), {
    flag: "wx",
  });
  return id;
}
export async function getGift(id: string): Promise<Gift | null> {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      id,
    )
  )
    return null;
  try {
    return JSON.parse(
      await fs.readFile(path.join(folder, `${id}.json`), "utf8"),
    );
  } catch {
    return null;
  }
}
