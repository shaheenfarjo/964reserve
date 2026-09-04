import { keys as analytics } from "@964reserve/analytics/keys";
import { keys as auth } from "@964reserve/auth/keys";
import { keys as database } from "@964reserve/database/keys";
import { keys as email } from "@964reserve/email/keys";
import { keys as core } from "@964reserve/next-config/keys";
import { keys as observability } from "@964reserve/observability/keys";
import { keys as payments } from "@964reserve/payments/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  extends: [
    auth(),
    analytics(),
    core(),
    database(),
    email(),
    observability(),
    payments(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
