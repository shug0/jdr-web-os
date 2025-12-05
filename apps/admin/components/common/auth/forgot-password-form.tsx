"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSupabase } from "@workspace/data/client";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  defaultForgotPasswordValues,
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@workspace/foundation/auth";
import { Mail } from "lucide-react";
import Logo from "@/components/common/logo";

export default function ForgotPasswordForm() {
  const { resetPassword } = useSupabase();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: defaultForgotPasswordValues,
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const { error } = await resetPassword(data.email);
      if (error) {
        throw error;
      }

      setIsEmailSent(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while sending the email.";
      form.setError("root", { message: errorMessage });
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <Logo size={48} />
              </div>
              <CardTitle className="text-2xl font-bold uppercase">
                Email sent
              </CardTitle>
              <CardDescription>Check your email</CardDescription>
            </CardHeader>

            <CardContent>
              <Alert>
                <AlertDescription>
                  A password reset email has been sent to{" "}
                  <strong>{form.getValues("email")}</strong>. Click on the link
                  in the email to create a new password.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="text-sm">
              <div className="w-full text-center">
                <Link href="/" className="underline font-bold underline-offset-3">
                  Back to sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
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
              Forgot password
            </CardTitle>
            <CardDescription>
              Enter your email address to receive a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            {form.formState.errors.root && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="you@example.com"
                    disabled={form.formState.isSubmitting}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-sm">
            <div className="w-full text-center">
              <Link href="/" className="underline font-bold underline-offset-3">
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}