"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { Destination } from "@/app/destinations/catalog";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const CATEGORIES = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Desert",
  "Island",
] as const;

type EditableDestination = Destination & {
  description: string;
  departureDate: string;
};

type DestinationForm = {
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const inputClassName =
  "h-12 rounded-none border-neutral-200 bg-neutral-50 px-4 text-[15px] shadow-none focus-visible:ring-brand/40";

export function EditDestinationDialog({
  destination,
}: {
  destination: EditableDestination;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [values, setValues] = React.useState<DestinationForm>(() => ({
    name: destination.name,
    country: destination.country,
    category: destination.category,
    price: String(destination.price),
    duration: destination.duration,
    departureDate: destination.departureDate,
    imageUrl: destination.image,
    description: destination.description,
  }));

  const setValue =
    (key: keyof DestinationForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setError("");
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    const token = await getTokenFromClient()
    event.preventDefault();
    if (!values.category.trim()) {
      setError("Choose a category for this destination.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/destinations/${encodeURIComponent(destination._id)}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...values,
            price: Number(values.price),
            rating: destination.rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`The update failed with status ${response.status}.`);
      }

      setOpen(false);
      toast.add({
        title: "Travel package updated",
        description: `"${values.name}" has been saved successfully.`,
        type: "success",
      });
      router.refresh();
    } catch (submitError) {
      toast.add({
        title: "Could not update the travel package",
        description: submitError instanceof Error
          ? submitError.message
          : "The destination could not be updated.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setError("");
      }}
    >
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-11 rounded-none border-neutral-200 px-5"
      >
        <PencilIcon />
        Edit
      </Button>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] gap-0 overflow-y-auto rounded-none bg-white p-0 sm:max-w-3xl"
      >
        <DialogHeader className="px-6 pb-0 pt-6 sm:px-10 sm:pt-8">
          <DialogTitle className="text-2xl font-normal tracking-[-0.03em]">
            Update Travel Package
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            Make changes to the travel package details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-8 sm:px-10 sm:pb-10">
          <div className="grid gap-5">
            <Field>
              <FieldLabel htmlFor="edit-destination-name" className="sr-only">
                Destination name
              </FieldLabel>
              <Input
                id="edit-destination-name"
                required
                value={values.name}
                onChange={setValue("name")}
                placeholder="Bali Paradise"
                className={inputClassName}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-destination-country">Country</FieldLabel>
                <Input
                  id="edit-destination-country"
                  required
                  value={values.country}
                  onChange={setValue("country")}
                  placeholder="Indonesia"
                  className={inputClassName}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-destination-category">Category</FieldLabel>
                <Select
                  value={values.category || null}
                  onValueChange={(category) => {
                    setValues((current) => ({
                      ...current,
                      category: category ?? "",
                    }));
                    setError("");
                  }}
                >
                  <SelectTrigger
                    id="edit-destination-category"
                    className={`${inputClassName} w-full justify-between`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-destination-price">Price (USD)</FieldLabel>
                <Input
                  id="edit-destination-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={values.price}
                  onChange={setValue("price")}
                  placeholder="e.g., 1299"
                  className={inputClassName}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-destination-duration">Duration</FieldLabel>
                <Input
                  id="edit-destination-duration"
                  required
                  value={values.duration}
                  onChange={setValue("duration")}
                  placeholder="e.g., 7 Days/6 Nights"
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="edit-destination-date">Departure Date</FieldLabel>
              <Input
                id="edit-destination-date"
                type="date"
                value={values.departureDate}
                onChange={setValue("departureDate")}
                className={inputClassName}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-destination-image">Image URL</FieldLabel>
              <Input
                id="edit-destination-image"
                type="url"
                value={values.imageUrl}
                onChange={setValue("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className={inputClassName}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-destination-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-destination-description"
                value={values.description}
                onChange={setValue("description")}
                placeholder="Describe the travel experience..."
                className="min-h-36 resize-y rounded-none border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] shadow-none focus-visible:ring-brand/40"
              />
            </Field>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="h-12 rounded-none border-red-500 px-5 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2Icon />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-12 rounded-none bg-brand px-5 text-white hover:bg-brand-dark"
            >
              <SaveIcon />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
