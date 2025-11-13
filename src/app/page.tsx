import { notion } from "~/lib/notion";
import { LandingPage } from "./page.client";

export const dynamic = "force-dynamic";

export default async function Page() {
  let waitlistPeople = 0;

  try {
    const response = await notion.databases.query({
      database_id: `${process.env.NOTION_DB}`,
    });
    waitlistPeople = response.results.length;
  } catch (error) {
    console.error("Error fetching waitlist count:", error);
  }

  return <LandingPage waitlistPeople={waitlistPeople} />;
}
