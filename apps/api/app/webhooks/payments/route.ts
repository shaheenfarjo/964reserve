import { analytics } from "@964reserve/analytics/server";
import { database } from "@964reserve/database";
import { parseError } from "@964reserve/observability/error";
import { log } from "@964reserve/observability/log";
import { payments } from "@964reserve/payments";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env";

const getUserFromCustomerId = async (customerId: string) => {
  const { data: usersResponse } = await database.auth.admin.listUsers();
  const fetchedUsers = usersResponse?.users || [];

  return fetchedUsers.find(
    (user) => user.user_metadata?.wayl_customer_id === customerId
  );
};

const handleOrderComplete = async (data: Record<string, unknown>) => {
  const customer = data.customer as Record<string, unknown> | undefined;
  if (!customer?.id || typeof customer.id !== "string") {
    return;
  }

  const customerId = customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "Payment Complete",
    distinctId: user.id,
  });
};

const handleOrderCancelled = async (data: Record<string, unknown>) => {
  const customer = data.customer as Record<string, unknown> | undefined;
  if (!customer?.id || typeof customer.id !== "string") {
    return;
  }

  const customerId = customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "Payment Cancelled",
    distinctId: user.id,
  });
};

export const POST = async (request: Request): Promise<Response> => {
  if (!(payments && env.WAYL_WEBHOOK_SECRET)) {
    return NextResponse.json({ message: "Not configured", ok: false });
  }

  try {
    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("x-wayl-signature-256");

    if (!signature) {
      throw new Error("missing x-wayl-signature-256 header");
    }

    if (!payments.verifyWebhook(body, signature)) {
      throw new Error("invalid webhook signature");
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "order.complete": {
        await handleOrderComplete(event);
        break;
      }
      case "order.cancelled":
      case "order.rejected": {
        await handleOrderCancelled(event);
        break;
      }
      default: {
        log.warn(`Unhandled event type ${event.event as string}`);
      }
    }

    await analytics?.shutdown();

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    const message = parseError(error);

    log.error(message);

    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
};
