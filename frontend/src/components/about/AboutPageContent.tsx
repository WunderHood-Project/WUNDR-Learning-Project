'use client'

import LeadershipSection from "./LeadershipSection";
import ContactUsSection from "../landing/contactUsSection";

export default function AboutPageContent() {
  return (
    <>
    {/* container */}
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 break-words">

      {/* Our Story  */}
      <section className="relative my-8 sm:my-12 md:my-16">
        {/* decorative "spots" */}
        <div className="pointer-events-none absolute -right-12 top-4 hidden h-40 w-40 rounded-full bg-wonderorange/30 blur-3xl sm:block" />
        <div className="pointer-events-none absolute -left-10 bottom-4 hidden h-32 w-32 rounded-full bg-wonderleaf/30 blur-3xl sm:block" />

        <div className="relative z-10 rounded-3xl border-2 border-wonderleaf/40 bg-gradient-to-br from-wondersun/30 via-wonderbg to-white shadow-2xl overflow-hidden">
          {/* Accent bar left*/}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-wonderleaf via-wondergreen to-wonderorange" />
          
          <div className="p-6 sm:p-8 md:p-10 pl-8 sm:pl-10 md:pl-12">
            <div className="mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-wondergreen to-wonderleaf bg-clip-text text-transparent">
                Our Story
              </h2>
            </div>

            <div className="rounded-2xl border border-wonderleaf/20 bg-white/80 p-5 sm:p-6 md:p-8 backdrop-blur-sm shadow-inner">
              <div className="space-y-4 sm:space-y-5 text-base sm:text-lg leading-relaxed text-gray-700">
                <p>
                  WonderHood began in Westcliffe, Colorado, to support homeschool and online-learning families in rural communities. 
                  Many homeschool and online learners love the flexibility of learning at home, but still miss steady friendships and a sense of belonging. 
                  In rural areas, it can be especially hard to meet peers regularly, and screen time can start to replace real-life connection.
                </p>
                <p>
                  We create welcoming spaces where students feel supported and truly seen. Through outdoor adventures, creative arts, STEAM exploration, life skills, and service projects, kids make friends, discover new interests, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mt-8 sm:mt-10 md:mt-12">
        <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2">
          {/* Mission */}
          <article className="group relative overflow-hidden rounded-3xl border-2 border-wonderleaf/40 bg-gradient-to-br from-wondersun/30 via-wonderbg to-white shadow-2xl transition-all duration-300 hover:shadow-wonderleaf/20 hover:scale-[1.02]">
            {/* Accent corner */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-wonderleaf/20 to-transparent rounded-bl-full" />
            
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-wondergreen to-wonderleaf bg-clip-text text-transparent">
                  Mission
                </h3>
              </div>

              <div className="rounded-2xl border border-wonderleaf/20 bg-white/80 p-5 sm:p-6 md:p-7 backdrop-blur-sm shadow-inner">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  Our mission is to help homeschool and online learners ages 10-18 build belonging, confidence, and healthy habits through outdoor adventures, creative arts, STEAM learning, and service projects.
                </p>
              </div>
            </div>
          </article>

          {/* Vision */}
          <article className="group relative overflow-hidden rounded-3xl border-2 border-wonderorange/40 bg-gradient-to-br from-wondersun/30 via-wonderbg to-white shadow-2xl transition-all duration-300 hover:shadow-wonderorange/20 hover:scale-[1.02]">
            {/* Accent corner */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-wonderorange/20 to-transparent rounded-bl-full" />
            
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-wonderorange to-wondersun bg-clip-text text-transparent">
                  Vision
                </h3>
              </div>

              <div className="rounded-2xl border border-wonderorange/20 bg-white/80 p-5 sm:p-6 md:p-7 backdrop-blur-sm shadow-inner">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  Our vision is a connected, thriving network of rural communities where every home-learning teen has access to friendship, mentorship, and meaningful real-world experiences.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Service Area & Youth Wellness */}
      <section className="mt-8 sm:mt-10 md:mt-12 [text-wrap:balance]">
        <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2">
          {/* Service Area */}
          <article className="group relative overflow-hidden rounded-3xl border-2 border-wonderleaf/40 bg-gradient-to-br from-wonderleaf/10 via-wonderbg to-white shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 left-0 h-24 w-24 bg-gradient-to-br from-wonderleaf/20 to-transparent rounded-br-full" />
            
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-wondergreen ">
                  Service Area
                </h3>
              </div>

              <div className="rounded-2xl border border-wonderleaf/20 bg-white/80 p-5 sm:p-6 md:p-7 backdrop-blur-sm">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  WonderHood's pilot programming is currently serving{" "}
                  <span className="font-bold text-wondergreen bg-wonderleaf/10 px-2 py-0.5 rounded">
                    Custer County (Westcliffe and surrounding areas)
                  </span>
                  . We plan to expand over time through partnerships, community readiness, and sustainable funding.
                </p>
              </div>
            </div>
          </article>

          {/* Why Youth Wellness */}
          <article className="group relative overflow-hidden rounded-3xl border-2 border-wonderorange/40 bg-gradient-to-br from-wonderorange/10 via-wonderbg to-white shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 left-0 h-24 w-24 bg-gradient-to-br from-wonderorange/20 to-transparent rounded-br-full" />
            
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-wonderorange">
                  Why Youth Wellness Matters
                </h3>
              </div>

              <div className="rounded-2xl border border-wonderorange/20 bg-white/80 p-5 sm:p-6 md:p-7 backdrop-blur-sm">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  We support youth well-being through connection, movement, and purpose. Our programs help reduce isolation, encourage healthy outdoor activity, and create positive leadership and service opportunities for teens. We also increase access to enrichment experiences and hands-on STEAM learning, which is especially important for rural and online learners, so kids feel connected, confident, and supported.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Why We Do It*/}
      <section className="mt-20 sm:mt-24 md:mt-28 mb-10 sm:mb-12 md:mb-16">
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-wondergreen via-wonderleaf to-wonderorange bg-clip-text text-transparent">
            Why We Do What We Do
          </h2>
          <div className="mx-auto h-1.5 w-32 rounded-full bg-gradient-to-r from-wonderleaf via-wondergreen to-wonderorange shadow-lg" />
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {/* 1 - Connection */}
          <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-wonderleaf/20 to-wondergreen/10 p-8 sm:p-10 border-2 border-wonderleaf/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:border-wonderleaf/50">
            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-wonderleaf/10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-wondergreen mb-4">
                Connection
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Online learners can spend long stretches learning independently. We create spaces where friendships form naturally – where kids can meet, connect, and feel part of a community.
              </p>
            </div>
          </article>

          {/* 2 - Skills for Life */}
          <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-wonderorange/20 to-wondersun/10 p-8 sm:p-10 border-2 border-wonderorange/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:border-wonderorange/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-wonderorange/10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-wonderorange mb-4">
                Skills for Life
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Communication, teamwork, leadership, and resilience are practiced through real projects, shared challenges, and meaningful experiences.
              </p>
            </div>
          </article>

          {/* 3 - Real-world Confidence */}
          <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-wondersun/30 to-wonderorange/15 p-8 sm:p-10 border-2 border-wondersun/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:border-wondersun/60">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-wondersun/10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-wonderorange mb-4">
                Real-world Confidence
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Trips, showcases, volunteering, and youth-led events help students try new roles, share their work, and discover what they're capable of.
              </p>
            </div>
          </article>

          {/* 4 - Healthy Choices */}
          <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-wondergreen/20 to-wonderleaf/10 p-8 sm:p-10 border-2 border-wondergreen/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:border-wondergreen/50">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-wondergreen/10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-wondergreen mb-4">
                Healthy Choices
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Outdoor activity, movement, mentoring, and positive peer groups help youth build strong habits, reduce stress, and stay grounded as they grow.
              </p>
            </div>
          </article>
        </div>
      </section>

      <LeadershipSection />
      <ContactUsSection />
    </div>
    
      
    </>
  );
}