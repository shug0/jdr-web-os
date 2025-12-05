import { redirect } from "next/navigation";
import { createClient } from "@workspace/data/server";
import DashboardLayout from "@/components/features/dashboard/layout";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  return <DashboardLayout userEmail={user.email || ""} />;
}
