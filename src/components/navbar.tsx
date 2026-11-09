"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon, UserRoundIcon, XIcon } from "lucide-react";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const NAV_LINKS = [
  { label: "Home", href: "/", current: true },
  { label: "Destinations", href: "/destinations", current: false },
  { label: "My Bookings", href: "/bookings", current: false },
  { label: "Admin", href: "/add_destination", current: false },
] as const;

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="#home"
      aria-label="Wanderlust home"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src="/images/Wanderlast.png"
        alt="Wanderlust"
        width={162}
        height={24}
        priority
        className="h-6 w-auto"
      />
    </Link>
  );
}

function NavLink({
  href,
  current,
  onClick,
  children,
}: {
  href: string;
  current?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={cn(
        "text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand",
        current && "text-brand",
      )}
    >
      {children}
    </Link>
  );
}

type ProfileUser =
  | {
      email?: string | null;
      image?: string | null;
      name?: string | null;
    }
  | null
  | undefined;

function UserAvatar({ user, className }: { user: ProfileUser; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.image || undefined} />
      <AvatarFallback>{user?.name?.charAt(0) || "CN"}</AvatarFallback>
    </Avatar>
  );
}

function ProfilePopover({
  user,
  onSignOut,
}: {
  user: ProfileUser;
  onSignOut: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open profile menu"
            className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <UserAvatar user={user} />
          </button>
        }
      >
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>{user?.name || "User"}</PopoverTitle>
          <PopoverDescription>
            {user?.email || "No email available"}
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-2 px-1 pb-1">
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/profile" />}
            className="w-full"
          >
            My Profile
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={onSignOut}
          >
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { data: session } = authClient.useSession();

  const user = session?.user;

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Sign Out Error:", error);
      return;
    }

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-360 px-6 lg:px-10"
      >
        <div className="hidden h-19 grid-cols-[1fr_auto_1fr] items-center lg:grid">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink href={link.href} current={link.current}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Logo />

          <div className="flex items-center justify-end gap-7">
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand"
            >
              <UserRoundIcon
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />
              Profile
            </Link>

            {user ? (
              <ProfilePopover user={user} onSignOut={handleSignOut} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex h-19 items-center justify-between lg:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-md text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {mobileOpen ? (
              <XIcon aria-hidden="true" className="size-5" />
            ) : (
              <MenuIcon aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-neutral-100 lg:hidden",
          !mobileOpen && "hidden",
        )}
      >
        <div className="px-6 pb-5 pt-3">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  href={link.href}
                  current={link.current}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="block py-2.5">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-col border-t border-neutral-100 pt-3">
            {user ? (
              <div className="flex items-center gap-3 py-2.5 text-[15px] font-medium text-neutral-800 lg:hidden">
                <ProfilePopover user={user} onSignOut={handleSignOut} />
                {user.name || "User"}
              </div>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand"
                >
                  <UserRoundIcon
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                  />
                  Profile
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-[15px] font-medium text-neutral-800 transition-colors hover:text-brand"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
