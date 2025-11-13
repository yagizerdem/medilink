/**
 * Generates Firebase-style Push IDs.
 * 20 chars long, time-ordered, lexicographically sortable, collision-safe.
 */
export function generatePushID(): string {
  const PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

  let staticLastPushTime =
    (generatePushID as any).lastPushTime || (0 as number);
  let staticLastRandChars =
    (generatePushID as any).lastRandChars || new Array<number>(12);

  let now = Date.now();
  const duplicateTime = now === staticLastPushTime;
  (generatePushID as any).lastPushTime = now;

  const timeStampChars = new Array<string>(8);
  for (let i = 7; i >= 0; i--) {
    timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
    now = Math.floor(now / 64);
  }

  if (now !== 0) {
    throw new Error("Timestamp conversion error.");
  }

  let id = timeStampChars.join("");

  if (!duplicateTime) {
    for (let i = 0; i < 12; i++) {
      staticLastRandChars[i] = Math.floor(Math.random() * 64);
    }
  } else {
    // Increment last random block
    let i: number;
    for (i = 11; i >= 0 && staticLastRandChars[i] === 63; i--) {
      staticLastRandChars[i] = 0;
    }
    staticLastRandChars[i]++;
  }

  (generatePushID as any).lastRandChars = staticLastRandChars;

  for (let i = 0; i < 12; i++) {
    id += PUSH_CHARS.charAt(staticLastRandChars[i]);
  }

  if (id.length !== 20) {
    throw new Error("Generated ID length should be 20 characters.");
  }

  return id;
}
