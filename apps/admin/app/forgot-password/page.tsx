import { redirect } from "next/navigation";
import { createClient } from "@workspace/data/server";
import ForgotPasswordForm from "@/components/common/auth/forgot-password-form";

export default async function ForgotPasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;
}