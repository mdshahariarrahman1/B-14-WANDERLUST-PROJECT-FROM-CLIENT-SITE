"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

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

const LoginPage = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const { email, password } = Object.fromEntries(
      form.entries()
    ) as Record<string, string>;

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (error) {
      console.error("Sign In Error:", error);
      return;
    }

    router.push("/");
  };

  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            Welcome Back
          </h1>
          <p className="mt-3 text-lg text-neutral-500">
            Resume your adventure with Wanderlust
          </p>
        </div>

        <Card className="w-full max-w-2xl rounded-md shadow-lg shadow-neutral-950/5 [--card-spacing:--spacing(10)]">
          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                void handleSignIn(event);
              }}
            >
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
                    placeholder="Enter your password"
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <Label className="flex items-center gap-2 text-[15px] text-neutral-950">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                Remember me
              </Label>

              <Button
                type="submit"
                className="h-12 w-full rounded-md bg-brand text-[15px] text-white hover:bg-brand-dark"
              >
                Sign In
              </Button>

              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-input" aria-hidden="true" />
                <span className="text-[15px] text-neutral-500">
                  Or continue with
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
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-brand hover:text-brand-dark"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LoginPage;
