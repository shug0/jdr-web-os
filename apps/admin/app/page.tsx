import { redirect } from "next/navigation";
import { createClient } from "@workspace/data/server";
import LoginForm from "@/components/common/auth/login-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Logo from "@/components/common/logo";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Logo size={48} />
            </div>
            <CardTitle className="text-2xl font-bold uppercase">
              Admin - jdr.coffee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
