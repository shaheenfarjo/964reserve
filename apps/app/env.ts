import { keys as analytics } from "@964reserve/analytics/keys";
import { keys as auth } from "@964reserve/auth/keys";
import { keys as collaboration } from "@964reserve/collaboration/keys";
import { keys as database } from "@964reserve/database/keys";
import { keys as email } from "@964reserve/email/keys";
import { keys as flags } from "@964reserve/feature-flags/keys";
import { keys as core } from "@964reserve/next-config/keys";
import { keys as notifications } from "@964reserve/notifications/keys";
import { keys as observability } from "@964reserve/observability/keys";
import { keys as security } from "@964reserve/security/keys";
import { keys as webhooks } from "@964reserve/webhooks/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  extends: [
    auth(),
    analytics(),
    collaboration(),
    core(),
    database(),
    email(),
    flags(),
    notifications(),
    observability(),
    security(),
    webhooks(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
