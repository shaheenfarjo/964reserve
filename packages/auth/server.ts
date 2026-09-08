import type { Database } from "@964reserve/database/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Ignore error
          }
        },
      },
    }
  );
};

export const currentUser = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  return {
    ...data.user,
  };
};

export const auth = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return {
    userId: data.user?.id,
    orgId: data.user?.user_metadata?.orgId ?? "mock-org-id",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    redirectToSignIn: () => {},
  };
};
