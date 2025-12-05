"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@workspace/data/client";
import { createClient } from "@workspace/data/client";
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
  defaultResetPasswordValues,
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@workspace/foundation/auth";
import { Lock } from "lucide-react";
import Logo from "@/components/common/logo";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session } = useSupabase();
  const [isValidSession, setIsValidSession] = useState(false);
  const [hasProcessedToken, setHasProcessedToken] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultResetPasswordValues,
  });

  // Memoize values to avoid re-creations and loops
  const sessionToken = useMemo(() => session?.access_token, [session?.access_token]);
  const userId = useMemo(() => user?.id, [user?.id]);

  useEffect(() => {
    // Avoid processing the token multiple times
    if (hasProcessedToken) {
      console.log("🔍 Debug reset-password: Token already processed, skipping");
      return;
    }

    const handlePasswordReset = async () => {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      try {
        // Modern format with token_hash (2024)
        if (tokenHash && type === "recovery") {
          console.log("🔍 Debug reset-password: Attempting verifyOtp with:", {
            tokenHash: `${tokenHash.slice(0, 10)}...`,
            type,
            fullUrl: window.location.href,
          });

          const supabase = createClient();
          const { error, data } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          console.log("🔍 Debug reset-password: verifyOtp result:", {
            hasError: !!error,
            errorMessage: error?.message,
            errorCode: error?.code,
            hasSession: !!data?.session,
            hasUser: !!data?.user,
            sessionDetails: data?.session
              ? {
                  userId: data.session.user?.id,
                  email: data.session.user?.email,
                }
              : null,
          });

          if (error) {
            console.error("❌ verifyOtp failed:", error);
            setIsValidSession(false);
          } else {
            console.log("✅ verifyOtp success, setting valid session");
            setIsValidSession(true);
          }
          setHasProcessedToken(true);
        }
        // Case of redirection from email with URL fragment
        else if (window.location.hash) {
          console.log("🔍 Debug reset-password: Found URL hash, checking for access_token");
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const tokenType = hashParams.get("type");

          console.log("🔍 Debug reset-password: Hash params:", {
            hasAccessToken: !!accessToken,
            tokenType,
            allHashParams: Object.fromEntries(hashParams.entries()),
          });

          if (accessToken && tokenType === "recovery") {
            console.log("✅ Found recovery access_token in hash, setting valid session");
            setIsValidSession(true);
          } else {
            console.log("❌ No valid recovery token in hash");
            setIsValidSession(false);
          }
          setHasProcessedToken(true);
        }
        // If user already logged in
        else if (sessionToken && userId) {
          console.log("✅ User already has valid session:", { userId: `${userId.slice(0, 8)}...` });
          setIsValidSession(true);
          setHasProcessedToken(true);
        } else {
          console.log("❌ No valid token_hash, hash, or existing session found");
          setIsValidSession(false);
          setHasProcessedToken(true);
        }
      } catch (err) {
        console.error("❌ Exception in handlePasswordReset:", err);
        setIsValidSession(false);
        setHasProcessedToken(true);
      }
    };

    handlePasswordReset();
  }, [searchParams, sessionToken, userId, hasProcessedToken]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      console.log("Password updated successfully");
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      form.setError("root", { message: errorMessage });
    }
  };

  if (!isValidSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-4">
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <Logo size={48} />
              </div>
              <CardTitle className="text-2xl font-bold uppercase">
                Invalid link
              </CardTitle>
              <CardDescription>This reset link is no longer valid</CardDescription>
            </CardHeader>

            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>
                  The password reset link has expired or is not valid. Please request a new link.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="text-sm">
              <div className="w-full text-center">
                <Link href="/forgot-password" className="underline font-bold underline-offset-3">
                  Request a new link
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
              New password
            </CardTitle>
            <CardDescription>Choose a new secure password</CardDescription>
          </CardHeader>

          <CardContent>
            {form.formState.errors.root && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    placeholder="••••••••"
                    disabled={form.formState.isSubmitting}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    placeholder="••••••••"
                    disabled={form.formState.isSubmitting}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Updating..." : "Update password"}
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