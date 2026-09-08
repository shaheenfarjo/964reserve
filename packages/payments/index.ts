import "server-only";
import { keys } from "./keys";
import { WaylProvider } from "./wayl";

export * from "./provider";

const { WAYL_API_TOKEN, WAYL_WEBHOOK_SECRET } = keys();

export const payments = WAYL_API_TOKEN
  ? new WaylProvider(WAYL_API_TOKEN, WAYL_WEBHOOK_SECRET)
  : undefined;
