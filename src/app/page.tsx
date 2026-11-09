import { Banner } from "@/components/banner"
import { Cta } from "@/components/cta"
import { FeaturedDestinations } from "@/components/featured-destinations"
import { Testimonials } from "@/components/testimonials"
import { WhyChoose } from "@/components/why-choose"

const Home = () => {
  return (
    <>
      
      <main className="flex-1">
        <Banner />
        <FeaturedDestinations />
        <WhyChoose />        
        <Testimonials />
        <Cta />
      </main>
      
    </>
  )
}

export default Home
