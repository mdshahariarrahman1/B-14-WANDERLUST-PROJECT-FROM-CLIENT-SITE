"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRoundIcon, Link2Icon, LockIcon, MailIcon, UserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export type ProfileUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function ProfileTabs({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();

    if (!name) {
      toast.add({
        title: "Display name required",
        description: "Add a name so your bookings can address you properly.",
        type: "error",
      });
      return;
    }

    setIsSavingProfile(true);

    try {
      const updates: { name: string; image?: string | null } = { name };

      if (image) {
        updates.image = image;
      }

      const { error } = await authClient.updateUser(updates);

      if (error) {
        console.error("Profile update failed:", error);
        toast.add({
          title: "Could not update your profile",
          description:
            error.message ??
            "The profile service could not complete your request.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Profile updated",
        description: "Your changes have been saved.",
        type: "success",
      });
      router.refresh();
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmedPassword = String(formData.get("confirmedPassword") ?? "");

    if (newPassword.length < 8) {
      toast.add({
        title: "Password too short",
        description: "Use at least 8 characters for your new password.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmedPassword) {
      toast.add({
        title: "Passwords do not match",
        description: "Re-enter the new password so both fields are identical.",
        type: "error",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (error) {
        console.error("Password change failed:", error);
        toast.add({
          title: "Could not change your password",
          description:
            error.message === "Invalid password. Please correct your input and try again."
              ? "Your current password is incorrect."
              : (error.message ??
                "The auth service could not complete your request."),
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Password updated",
        description: "Use your new password next time you sign in.",
        type: "success",
      });
      event.currentTarget.reset();
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Tabs defaultValue="profile">
      <TabsList variant="line">
        <TabsTrigger value="profile">
          <UserRoundIcon data-icon="inline-start" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security">
          <LockIcon data-icon="inline-start" />
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-4">
        <Card className="rounded-2xl border border-neutral-200 bg-white shadow-none [--card-spacing:--spacing(6)]">
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleUpdateProfile}>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="profile-name"
                  className="text-[15px] text-neutral-950"
                >
                  Display Name
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <UserRoundIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="profile-name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    defaultValue={user.name ?? ""}
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="profile-image"
                  className="text-[15px] text-neutral-950"
                >
                  Avatar Image URL
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <Link2Icon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="profile-image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    defaultValue={user.image ?? ""}
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="profile-email"
                  className="text-[15px] text-neutral-950"
                >
                  Email Address
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50" aria-disabled>
                  <InputGroupAddon>
                    <MailIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="profile-email"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className="h-full cursor-default"
                  />
                </InputGroup>
                <p className="text-sm text-neutral-500">
                  Your sign-in email can&apos;t be changed.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSavingProfile}
                className="h-12 rounded-md bg-brand text-[15px] text-white hover:bg-brand-dark"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-4">
        <Card className="rounded-2xl border border-neutral-200 bg-white shadow-none [--card-spacing:--spacing(6)]">
          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleChangePassword}>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="current-password"
                  className="text-[15px] text-neutral-950"
                >
                  Current Password
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <LockIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    required
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <div className="border-t border-neutral-200" />

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="new-password"
                  className="text-[15px] text-neutral-950"
                >
                  New Password
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <KeyRoundIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="new-password"
                    name="newPassword"
                    type="password"
                    placeholder="At least 8 characters"
                    required
                    className="h-full"
                  />
                </InputGroup>
                <p className="text-sm text-neutral-500">
                  Must be at least 8 characters.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-[15px] text-neutral-950"
                >
                  Confirm New Password
                </Label>
                <InputGroup className="h-11 rounded-md bg-input/50">
                  <InputGroupAddon>
                    <KeyRoundIcon className="text-neutral-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="confirm-password"
                    name="confirmedPassword"
                    type="password"
                    placeholder="Re-enter your new password"
                    required
                    className="h-full"
                  />
                </InputGroup>
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="h-12 rounded-md bg-brand text-[15px] text-white hover:bg-brand-dark"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default ProfileTabs;
