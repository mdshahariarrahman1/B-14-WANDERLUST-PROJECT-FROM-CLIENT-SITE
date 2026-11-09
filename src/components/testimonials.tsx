import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const TESTIMONIALS = [
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person2.png",
    imageAlt: "Portrait of Sarah Johnson",
  },
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person1.png",
    imageAlt: "Portrait of Michael Chen",
  },
  {
    quote:
      "Santorini Sunset Cruise Was A Dream Come True. The Team Handled Every Booking Flawlessly And Even Surprised Us With A Private Island Tour.",
    name: "Md Shahariar Rahman",
    location: "Rangpur, Bangladesh",
    image: "/images/person3.png",
    imageAlt: "Portrait of Emma Rodriguez",
  },
] as const

const arrowClassName =
  "static size-12 border-neutral-300 bg-white text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 focus-visible:border-neutral-400 focus-visible:ring-neutral-300 disabled:opacity-100 disabled:text-neutral-300 lg:size-14 [&_svg]:size-5"

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="bg-white py-16 sm:py-20 lg:pb-20 lg:pt-32"
    >
      <div className="mx-auto w-full max-w-360 px-6 lg:px-20">
        <Carousel
          aria-label="Traveler testimonials"
          opts={{ align: "start", loop: true }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="testimonials-title"
                className="text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-5xl"
              >
                What Travelers Say
              </h2>
              <p className="mt-2 text-lg font-light text-neutral-600 sm:mt-3 sm:text-xl">
                Real experiences from our happy travelers
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto lg:gap-5">
              <CarouselPrevious className={arrowClassName} />
              <CarouselNext className={arrowClassName} />
            </div>
          </div>

          <CarouselContent className="-ml-6 mt-11">
            {TESTIMONIALS.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="pl-6 xl:basis-1/2"
              >
                <figure className="flex h-full flex-col-reverse gap-6 border border-neutral-200 bg-white p-6 sm:flex-row sm:p-6">
                  <div className="flex flex-1 flex-col">
                    <blockquote className="text-lg leading-[1.35] tracking-[-0.01em] text-neutral-900 sm:text-[20px] sm:leading-[1.3]">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    <figcaption className="mt-auto pt-8">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-px w-4 shrink-0 bg-brand"
                        />
                        <span className="text-lg text-brand">
                          {testimonial.name}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">
                        {testimonial.location}
                      </p>
                    </figcaption>
                  </div>

                  <div className="relative h-60 w-full shrink-0 overflow-hidden sm:h-67.5 sm:w-54.5">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.imageAlt}
                      fill
                      sizes="(min-width: 640px) 218px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
