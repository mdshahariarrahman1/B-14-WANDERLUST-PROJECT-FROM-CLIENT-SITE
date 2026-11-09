"use client";
import React from "react";
import Link from "next/link";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirm-password") ?? "");

    if (!name || !email || !password || !confirmPassword) {
      toast.add({
        title: "Complete all fields",
        description: "Enter your name, email, and password to create an account.",
        type: "error",
      });
      return;
    }

    if (password.length < 8) {
      toast.add({
        title: "Password is too short",
        description: "Use a password with at least 8 characters.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.add({
        title: "Passwords do not match",
        description: "Check both password fields and try again.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        console.error("Sign up failed:", {
          code: error.code,
          message: error.message,
          status: error.status,
          statusText: error.statusText,
        });
        toast.add({
          title: "Could not create your account",
          description:
            error.message ||
            error.statusText ||
            "Please check your details and try again.",
          type: "error",
        });
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Sign up request failed:", error);
      toast.add({
        title: "Could not create your account",
        description:
          error instanceof Error
            ? error.message
            : "The authentication service could not complete your request.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            Create Account
          </h1>
          <p className="mt-3 text-lg text-neutral-500">
            Start your adventure with Wanderlust
          </p>
        </div>

        <Card className="w-full max-w-2xl rounded-md shadow-lg shadow-neutral-950/5 [--card-spacing:--spacing(10)]">
          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                void handleSignUp(event);
              }}
            >
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="full-name"
                  className="text-[15px] text-neutral-950"
                >
                  Full Name
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <UserIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="full-name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Enter your name"
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-[15px] text-neutral-950">
                  Email Address
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <MailIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className="text-[15px] text-neutral-950"
                >
                  Password
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <LockIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    placeholder="Create a password"
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-[15px] text-neutral-950"
                >
                  Confirm Password
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <LockIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    placeholder="Confirm your password"
                    className="h-full"
                  />
                </InputGroup>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-md bg-brand text-[15px] text-white hover:bg-brand-dark"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-input" aria-hidden="true" />
                <span className="text-[15px] text-neutral-500">
                  Or sign up with
                </span>
                <span className="h-px flex-1 bg-input" aria-hidden="true" />
              </div>

              {/* Visual only: auth.ts has no Google social provider configured yet. */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-md text-[15px]"
              >
                <GoogleIcon className="size-5" />
                Sign Up With Google
              </Button>

              <p className="mt-2 text-center text-[15px] text-neutral-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-brand hover:text-brand-dark"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignUpPage;
