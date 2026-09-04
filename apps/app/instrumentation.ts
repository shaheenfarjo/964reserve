import { initializeSentry } from "@964reserve/observability/instrumentation";

export const register = initializeSentry;
export { onRequestError } from "@964reserve/observability/instrumentation";
