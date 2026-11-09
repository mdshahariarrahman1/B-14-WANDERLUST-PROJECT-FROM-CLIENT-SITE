"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, Trash2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import type { Destination } from "@/app/destinations/catalog";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export function DeleteDestinationDialog({
  destination,
}: {
  destination: Pick<Destination, "_id" | "name">;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {

    const token = await getTokenFromClient()

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/destinations/${encodeURIComponent(destination._id)}`,
        { method: "DELETE",
          headers:{
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          }
         }
      );

      if (!response.ok) {
        throw new Error(`The deletion failed with status ${response.status}.`);
      }

      setOpen(false);
      toast.add({
        title: "Travel package deleted",
        description: `"${destination.name}" has been permanently removed.`,
        type: "success",
      });
      router.push("/destinations");
      router.refresh();
    } catch (deleteError) {
      toast.add({
        title: "Could not delete the travel package",
        description: deleteError instanceof Error
          ? deleteError.message
          : "The travel package could not be deleted.",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
      }}
    >
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-11 rounded-none border-red-500 px-5 text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2Icon />
        Cancel
      </Button>
      <AlertDialogContent className="w-full max-w-[calc(100%-2rem)]! sm:max-w-xl! gap-0 rounded-xl border-0 bg-white p-6 shadow-xl sm:p-8">
        <AlertDialogCancel
          variant="ghost"
          size="icon"
          aria-label="Close confirmation"
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-900"
        >
          <XIcon />
        </AlertDialogCancel>

        <div className="flex items-center gap-4 pr-8">
          <AlertDialogMedia className="mb-0 size-14 shrink-0 rounded-full bg-red-50 text-red-500 [&_svg:not([class*='size-'])]:size-6">
            <AlertTriangleIcon />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-2xl font-normal tracking-[-0.03em]">
            Delete Travel Package
          </AlertDialogTitle>
        </div>

        <AlertDialogDescription className="mt-4 text-[15px] leading-6 text-neutral-600">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-neutral-900">
            &quot;{destination.name}&quot;
          </strong>
          ? This action cannot be undone and will permanently remove this travel
          package from the system.
        </AlertDialogDescription>

        <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <AlertDialogCancel
            disabled={deleting}
            className="h-12 min-w-28 rounded-none border-neutral-200 bg-white px-5 text-neutral-600 hover:bg-neutral-50"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="h-12 rounded-none bg-red-500 px-5 text-white hover:bg-red-600"
          >
            <Trash2Icon />
            {deleting ? "Deleting..." : "Delete Package"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
