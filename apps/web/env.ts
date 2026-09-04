import { keys as cms } from "@964reserve/cms/keys";
import { keys as email } from "@964reserve/email/keys";
import { keys as flags } from "@964reserve/feature-flags/keys";
import { keys as core } from "@964reserve/next-config/keys";
import { keys as observability } from "@964reserve/observability/keys";
import { keys as rateLimit } from "@964reserve/rate-limit/keys";
import { keys as security } from "@964reserve/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  extends: [
    cms(),
    core(),
    email(),
    observability(),
    flags(),
    security(),
    rateLimit(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
