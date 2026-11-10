import { redirect } from "next/navigation";

export const metadata = { title: "Review entries" };
export const dynamic = "force-dynamic";

export default function ReviewPage() {
  // Preserve existing review links while keeping the dashboard in one place.
  redirect("/admin?tab=queue");
}
