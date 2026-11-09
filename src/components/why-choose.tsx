import Image from "next/image"

const FEATURES = [
  {
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
    icon: "/images/ShieldCheck.png",
  },
  {
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
    icon: "/images/MapTrifold.png",
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
    icon: "/images/Headset.png",
  },
] as const

export function WhyChoose() {
  return (
    <section
      id="why-choose"
      aria-labelledby="why-choose-title"
      className="bg-[#eaf8fc] py-16 sm:py-20 lg:pb-36 lg:pt-32"
    >
      <div className="mx-auto w-full max-w-360 px-6 lg:px-20">
        <div className="text-center">
          <h2
            id="why-choose-title"
            className="text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-5xl"
          >
            Why Choose Wanderlust
          </h2>
          <p className="mt-2 text-lg font-light text-neutral-600 sm:mt-3 sm:text-xl">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <ul className="mt-11 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="flex h-full flex-col bg-white p-8 lg:p-10"
            >
              <Image
                src={feature.icon}
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                sizes="48px"
                className="size-12"
              />
              <h3 className="mt-5 text-[26px] font-normal tracking-[-0.02em] text-neutral-950 lg:text-3xl">
                {feature.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 lg:text-base">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
