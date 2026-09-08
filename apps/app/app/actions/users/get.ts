"use server";

import { auth } from "@964reserve/auth/server";
import { database } from "@964reserve/database";

const colors = [
  "var(--color-red-500)",
  "var(--color-orange-500)",
  "var(--color-amber-500)",
  "var(--color-yellow-500)",
  "var(--color-lime-500)",
  "var(--color-green-500)",
  "var(--color-emerald-500)",
  "var(--color-teal-500)",
  "var(--color-cyan-500)",
  "var(--color-sky-500)",
  "var(--color-blue-500)",
  "var(--color-indigo-500)",
  "var(--color-violet-500)",
  "var(--color-purple-500)",
  "var(--color-fuchsia-500)",
  "var(--color-pink-500)",
  "var(--color-rose-500)",
];

export const getUsers = async (
  userIds: string[]
): Promise<
  | {
      data: unknown[];
    }
  | {
      error: unknown;
    }
> => {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      throw new Error("Not logged in");
    }

    const { data: users } = await database.auth.admin.listUsers();

    // We are mocking a fallback in case the service role key is not used
    // and admin API fails.
    const fetchedUsers = users?.users || [];

    const data: unknown[] = fetchedUsers
      .filter((user) => user.id && userIds.includes(user.id))
      .map((user) => ({
        name: user.email ?? "Unknown user",
        picture: user.user_metadata?.avatar_url ?? "",
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

    return { data };
  } catch (error) {
    return { error };
  }
};
