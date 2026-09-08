import { database } from "@964reserve/database";
import { sendEmail } from "@964reserve/email";
import { parseError } from "@964reserve/observability/error";
import { log } from "@964reserve/observability/log";
import { payments } from "@964reserve/payments";
import { NextResponse } from "next/server";

// Assuming we have a `subscriptions` table managed via Supabase with fields:
// id, user_id, status, next_billing_date, amount, currency
export const GET = async (): Promise<Response> => {
  if (!payments) {
    return NextResponse.json({
      message: "Payments not configured",
      ok: false,
    });
  }

  try {
    // Basic authorization could go here, e.g., checking a CRON_SECRET

    const now = new Date().toISOString();

    // Find active subscriptions that are due for renewal
    const { data: dueSubscriptions, error } = await database
      .from("subscriptions")
      .select("*")
      .eq("status", "active")
      .lte("next_billing_date", now);

    if (error) {
      throw new Error(`Failed to fetch subscriptions: ${error.message}`);
    }

    let processed = 0;
    for (const sub of dueSubscriptions || []) {
      try {
        const { data: userResponse } = await database.auth.admin.getUserById(
          sub.user_id
        );
        const user = userResponse?.user;

        if (!user?.email) {
          log.warn(`User ${sub.user_id} not found or has no email.`);
          continue;
        }

        // Generate a new one-off Wayl link for this renewal invoice
        const link = await payments.createPaymentLink({
          referenceId: `renewal_${sub.id}_${Date.now()}`,
          total: sub.amount,
          currency: "IQD",
          lineItems: [
            {
              label: "Subscription Renewal",
              amount: sub.amount,
              type: "increase",
            },
          ],
        });

        // Email the user
        await sendEmail({
          to: user.email,
          subject: "Your Subscription Renewal is Due",
          text: `Please pay your subscription renewal of ${sub.amount} IQD by visiting: ${link.url}`,
        });

        // Update local status to pending payment
        await database
          .from("subscriptions")
          .update({
            status: "pending_payment",
            latest_invoice_url: link.url,
          })
          .eq("id", sub.id);

        processed++;
      } catch (subError) {
        log.error(
          `Failed to process subscription ${sub.id}: ${parseError(subError)}`
        );
      }
    }

    return NextResponse.json({
      message: `Processed ${processed} subscriptions`,
      ok: true,
    });
  } catch (error) {
    log.error(`Cron error: ${parseError(error)}`);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
};
