import { initializeAnalytics } from "@964reserve/analytics/instrumentation-client";
import { initializeSentry } from "@964reserve/observability/client";

initializeSentry();
initializeAnalytics();

export { onRouterTransitionStart } from "@964reserve/observability/client";
