import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore error
          }
        },
      },
    }
  );
};

export interface OrganizationMembership {
  id: string;
  publicUserData?: {
    firstName?: string;
    lastName?: string;
    identifier?: string;
  };
}

export const auth = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return {
    userId: data.user?.id,
    orgId: data.user?.user_metadata?.orgId ?? "mock-org-id",
    redirectToSignIn: () => {},
  };
};

export const currentUser = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  return {
    id: data.user.id,
    fullName: data.user.user_metadata?.full_name,
    imageUrl: data.user.user_metadata?.avatar_url,
    emailAddresses: [{ emailAddress: data.user.email }],
    privateMetadata: {
      stripeCustomerId: data.user.user_metadata?.stripe_customer_id,
    },
  };
};
