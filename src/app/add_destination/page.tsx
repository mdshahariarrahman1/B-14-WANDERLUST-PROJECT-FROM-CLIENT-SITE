"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlusIcon, TrashIcon } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

type FormState = {
  name: string;
  country: string;
  category: string;
  price: string;
  rating: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  name: "",
  country: "",
  category: "",
  price: "",
  rating: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

const controlClassName =
  "h-12 rounded-[4px] border-none bg-neutral-50 px-4 text-[15px] text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-brand/40 md:text-[15px]";

const AddDestinationPage = () => {
  const router = useRouter();
  const [values, setValues] = React.useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const setValue = (key: keyof FormState) => (value: string) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    for (const key of Object.keys(values) as Array<keyof FormState>) {
      if (!values[key].trim()) {
        next[key] = "This field is required.";
      }
    }

    if (
      values.imageUrl.trim() &&
      !/^https?:\/\/.+/i.test(values.imageUrl.trim())
    ) {
      next.imageUrl = "Enter a valid URL starting with http:// or https://.";
    }

    if (values.price.trim() && !/^\d+(\.\d{1,2})?$/.test(values.price.trim())) {
      next.price = "Enter a number, e.g. 1299.";
    }

    if (values.rating.trim() && !/^\d+(\.\d{1,2})?$/.test(values.rating.trim())) {
      next.rating = "Enter a number, e.g. 4.5.";
    } else if (values.rating.trim() && Number(values.rating) > 5) {
      next.rating = "Enter a rating of 5 or below.";
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    const token = await getTokenFromClient()
    
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/add_destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values, rating: Number(values.rating) }),
      });

      if (!res.ok) {
        throw new Error(`The request failed with status ${res.status}.`);
      }

      toast.add({
        title: "Travel package added successfully",
        description: `"${values.name}" is now live in Destinations.`,
        type: "success",
      });
      router.push("/destinations");
    } catch (error) {
      console.error("Package submission failed:", error);
      toast.add({
        title: "Could not add the travel package",
        description: "Please try again — the destination service may be offline.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues(INITIAL_STATE);
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100svh-595px)] bg-white pb-16 text-neutral-900 lg:pb-24">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-20">
        <h1 className="pt-10 text-[clamp(2.25rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] text-neutral-950">
          Add New Travel Package
        </h1>

        <Card className="mx-auto mt-20 w-full rounded-md border border-neutral-200 bg-white shadow-sm ring-0">
          <CardContent className="px-6 py-8 sm:px-10 lg:px-10 lg:py-10">
            <form noValidate onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:gap-x-5">
                <Field data-invalid={!!errors.name}>
                  <FieldLabel
                    htmlFor="destination-name"
                    className="text-base font-medium text-neutral-900"
                  >
                    Destination Name
                  </FieldLabel>
                  <Input
                    id="destination-name"
                    name="name"
                    value={values.name}
                    onChange={(event) => setValue("name")(event.target.value)}
                    aria-invalid={!!errors.name}
                    placeholder="Bali Paradise"
                    className={controlClassName}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-5">
                  <Field data-invalid={!!errors.country}>
                    <FieldLabel
                      htmlFor="destination-country"
                      className="text-base font-medium text-neutral-900"
                    >
                      Country
                    </FieldLabel>
                    <Input
                      id="destination-country"
                      name="country"
                      value={values.country}
                      onChange={(event) =>
                        setValue("country")(event.target.value)
                      }
                      aria-invalid={!!errors.country}
                      placeholder="Indonesia"
                      className={controlClassName}
                    />
                    {errors.country && (
                      <FieldError>{errors.country}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.category}>
                    <FieldLabel
                      htmlFor="destination-category"
                      className="text-base font-medium text-neutral-900"
                    >
                      Category
                    </FieldLabel>
                    <Select
                      name="category"
                      value={values.category}
                      onValueChange={(value) =>
                        setValue("category")(value ?? "")
                      }
                    >
                      <SelectTrigger
                        id="destination-category"
                        aria-invalid={!!errors.category}
                        className={`${controlClassName} w-full justify-between`}
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
                    {errors.category && (
                      <FieldError>{errors.category}</FieldError>
                    )}
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-5">
                  <Field data-invalid={!!errors.price}>
                    <FieldLabel
                      htmlFor="destination-price"
                      className="text-base font-medium text-neutral-900"
                    >
                      Price (USD)
                    </FieldLabel>
                    <Input
                      id="destination-price"
                      name="price"
                      inputMode="decimal"
                      value={values.price}
                      onChange={(event) =>
                        setValue("price")(event.target.value)
                      }
                      aria-invalid={!!errors.price}
                      placeholder="e.g., 1299"
                      className={controlClassName}
                    />
                    {errors.price && <FieldError>{errors.price}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.duration}>
                    <FieldLabel
                      htmlFor="destination-duration"
                      className="text-base font-medium text-neutral-900"
                    >
                      Duration
                    </FieldLabel>
                    <Input
                      id="destination-duration"
                      name="duration"
                      value={values.duration}
                      onChange={(event) =>
                        setValue("duration")(event.target.value)
                      }
                      aria-invalid={!!errors.duration}
                      placeholder="e.g., 7 Days/6 Nights"
                      className={controlClassName}
                    />
                    {errors.duration && (
                      <FieldError>{errors.duration}</FieldError>
                    )}
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-5">
                  <Field data-invalid={!!errors.rating}>
                    <FieldLabel
                      htmlFor="destination-rating"
                      className="text-base font-medium text-neutral-900"
                    >
                      Rating
                    </FieldLabel>
                    <Input
                      id="destination-rating"
                      name="rating"
                      inputMode="decimal"
                      value={values.rating}
                      onChange={(event) =>
                        setValue("rating")(event.target.value)
                      }
                      aria-invalid={!!errors.rating}
                      placeholder="e.g., 4.5"
                      className={controlClassName}
                    />
                    {errors.rating && <FieldError>{errors.rating}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.departureDate}>
                    <FieldLabel
                      htmlFor="destination-departure"
                      className="text-base font-medium text-neutral-900"
                    >
                      Departure Date
                    </FieldLabel>
                    <Input
                      id="destination-departure"
                      name="departureDate"
                      type="date"
                      value={values.departureDate}
                      onChange={(event) =>
                        setValue("departureDate")(event.target.value)
                      }
                      aria-invalid={!!errors.departureDate}
                      className={`${controlClassName} [&::-webkit-calendar-picker-indicator]:hidden`}
                    />
                    {errors.departureDate && (
                      <FieldError>{errors.departureDate}</FieldError>
                    )}
                  </Field>
                </div>

                <Field data-invalid={!!errors.imageUrl}>
                  <FieldLabel
                    htmlFor="destination-image"
                    className="text-base font-medium text-neutral-900"
                  >
                    Image URL
                  </FieldLabel>
                  <Input
                    id="destination-image"
                    name="imageUrl"
                    type="url"
                    value={values.imageUrl}
                    onChange={(event) =>
                      setValue("imageUrl")(event.target.value)
                    }
                    aria-invalid={!!errors.imageUrl}
                    placeholder="https://example.com/image.jpg"
                    className={controlClassName}
                  />
                  {errors.imageUrl && (
                    <FieldError>{errors.imageUrl}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.description}>
                  <FieldLabel
                    htmlFor="destination-description"
                    className="text-base font-medium text-neutral-900"
                  >
                    Description
                  </FieldLabel>
                  <Textarea
                    id="destination-description"
                    name="description"
                    value={values.description}
                    onChange={(event) =>
                      setValue("description")(event.target.value)
                    }
                    aria-invalid={!!errors.description}
                    placeholder="Describe the travel experience..."
                    className={`${controlClassName} h-37.5 resize-none px-4 py-3.5`}
                  />
                  {errors.description && (
                    <FieldError>{errors.description}</FieldError>
                  )}
                </Field>
              </div>

              <div className="mt-10 flex flex-col justify-end gap-4 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-12 gap-2 rounded-lg border-destructive/60 bg-white px-7 text-base text-destructive hover:bg-destructive/5 aria-expanded:bg-white aria-expanded:text-destructive"
                >
                  <TrashIcon />
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 gap-2.5 rounded-lg bg-brand px-7 text-base font-medium text-white hover:bg-brand-dark"
                >
                  <BookmarkPlusIcon />
                  Add Travel Package
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddDestinationPage;