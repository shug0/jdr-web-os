import { Suspense } from "react";
import ResetPasswordForm from "@/components/common/auth/reset-password-form";

function ResetPasswordFormWrapper() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormWrapper />
    </Suspense>
  );
}