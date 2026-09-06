"use server";

import { auth } from "@964reserve/auth/server";
import { database } from "@964reserve/database";
import Fuse from "fuse.js";

export const searchUsers = async (
  query: string
): Promise<
  | {
      data: string[];
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

    const { data: usersResponse } = await database.auth.admin.listUsers();
    const fetchedUsers = usersResponse?.users || [];

    const users = fetchedUsers.map((user) => ({
      id: user.id,
      name: user.email,
      imageUrl: user.user_metadata?.avatar_url,
    }));

    const fuse = new Fuse(users, {
      keys: ["name"],
      minMatchCharLength: 1,
      threshold: 0.3,
    });

    const results = fuse.search(query);
    const data = results.map((result) => result.item.id);

    return { data };
  } catch (error) {
    return { error };
  }
};
