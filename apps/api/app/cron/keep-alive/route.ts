import { database } from "@964reserve/database";

export const GET = async () => {
  const { data: newPage } = await database
    .from("Page")
    .insert({ name: "cron-temp" })
    .select("id")
    .single();

  if (newPage) {
    await database.from("Page").delete().eq("id", newPage.id);
  }

  return new Response("OK", { status: 200 });
};
