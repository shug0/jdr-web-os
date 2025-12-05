"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@workspace/data/client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Loader2, Mail, Lock } from "lucide-react";
import {
  signInSchema,
  defaultSignInValues,
  type SignInFormValues,
} from "@workspace/foundation/auth";

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useSupabase();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { ...defaultSignInValues },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        throw error;
      }

      console.log("Login successful for user:", data.email);
      // Force refresh to update server-side state
      router.refresh();
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      form.setError("root", { message: errorMessage });
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
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
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            disabled={form.formState.isSubmitting}
            className="pl-10"
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-3"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
