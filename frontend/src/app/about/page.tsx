'use client'

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      {/* Main Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 pb-8">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-wondergreen text-center mb-4">
          Who We Are
        </h1>
        <p className="text-xl text-gray-700 text-center mb-8 max-w-5xl mx-auto">
          WonderHood unites Colorado homeschool families who want real connection, adventure, and a thriving, supportive community for their kids.
        </p>
      </section>

      {/* Our Story Section */}
      <div className="bg-gradient-to-br from-wondersun/30 via-wonderbg to-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border-2 border-wonderleaf/30 mb-16 max-w-5xl mx-auto relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-6 right-6 w-32 h-32 bg-wonderorange/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-8 left-8 w-28 h-28 bg-wonderleaf/25 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-wondergreen/15 rounded-full blur-xl pointer-events-none"></div>
        
        {/* Content with relative positioning */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-4 h-12 bg-gradient-to-b from-wonderleaf via-wondergreen to-wonderorange rounded-full shadow-lg"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-wondergreen drop-shadow-sm">Our Story</h2>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-wonderleaf/20">
            <p className="text-lg text-gray-700 leading-relaxed">
              WonderHood was born out of a desire to give our children more than just academics—to help them find lasting friendships, learn practical life skills, and thrive through teamwork, creativity, and outdoor adventure. We believe that every child deserves a vibrant community, a safe space to grow, and real-life experiences that inspire confidence, purpose, and joy.
              <br/><br/>
              Our mission is to unite kids of all ages, spark their curiosity, and offer positive alternatives to screens, isolation, and harmful habits. We want to help youth find their place, discover new interests, and make memories that last a lifetime.
            </p>
          </div>
        </div>
      </div>

      {/* Why We Do It */}
      <div className="mb-12 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-wondergreen mb-4">
            Why We Do It?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-wonderleaf to-wonderorange mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-wonderleaf/10 to-wondergreen/5 rounded-xl p-6 border-l-4 border-wonderleaf ">
              <p className="text-gray-700 leading-relaxed">
                At WonderHood, we believe every child deserves not just knowledge, but skills for life—friendship, teamwork, confidence, and real joy.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-wonderorange/10 to-wondersun/5 rounded-xl p-6 border-l-4 border-wonderorange">
              <p className="text-gray-700 leading-relaxed">
                We offer fun, creative, and educational events that bring families together, help teens build leadership skills, and show every child they belong.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-wondergreen/10 to-wonderleaf/5 rounded-xl p-6 border-l-4 border-wondergreen">
              <p className="text-gray-700 leading-relaxed">
                Our community helps kids grow through shared adventures, group projects, and opportunities to shine—no matter their background or learning style.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-wondersun/20 to-wonderorange/10 rounded-xl p-6 border-l-4 border-wondersun">
              <p className="text-gray-700 leading-relaxed">
                In the future, we&aposll launch even more clubs, workshops, and camps—creating a safe, inspiring environment for youth and their families across Colorado.
              </p>
            </div>
          </div>
        </div>

        {/* For Teens/College Volunteers */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-wondergreen/20 mt-14 group mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-wondergreen to-wonderleaf rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">🌟</span>
            </div>
            <h3 className="font-bold text-wondergreen text-xl md:text-2xl">
              Volunteer Hours for Teens & College Students
            </h3>
          </div>
          <p className="text-gray-700 mb-3">
            WonderHood gives teens and college students a chance to earn service hours, develop leadership, and make a real impact. Want to help, lead a club, or start something new? Email us:{" "}
            <a
              href="mailto:wonderhood.project@gmail.com"
              className="text-wonderleaf underline hover:text-wondergreen"
            >
              wonderhood.project@gmail.com
            </a>
            .
          </p>
        </div>


        {/* Bottom Mission Statement */}
        <div className="mt-8 bg-gradient-to-r from-wondergreen to-wonderleaf rounded-2xl p-8 text-white text-center">
          <p className="text-lg md:text-xl leading-relaxed">
            By connecting families, building community, and creating real opportunities, WonderHood aims to fill the gaps in home education—and add even more to children&aposs lives.
          </p>
        </div>
      </div>

      {/* How to Join Section */}
      <div className="bg-gradient-to-br from-wondersun/30 via-wonderbg to-white rounded-2xl p-8 md:p-12 shadow-lg border-2 border-wonderorange/30 mb-12 relative overflow-hidden max-w-5xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-28 h-28 bg-wonderorange/40 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-wonderleaf/40 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-wonderorange to-wondersun rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">!</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-wondergreen">How to Join</h2>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              Membership is <span className="font-bold text-wondergreen bg-wondersun/30 px-2 py-1 rounded">free</span> for all homeschool families with kids ages <span className="font-bold text-wonderorange">10-18</span>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-2">
              Just sign up form for your child and join any club, or contact us with questions — you&aposre always welcome!
            </p>
          </div>
          
          <div className="text-center">
            <a
              href="mailto:wonderhood.project@gmail.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-wonderleaf to-wondergreen text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>✉</span>
              wonderhood.project@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Get Involved Section */}
      <div className="mb-12 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-wondergreen mb-4">
            Get Involved
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-wonderorange to-wonderleaf mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Volunteer Card */}
          <Link href="/volunteer" className="group block">
            <div className="bg-white rounded-xl p-6 pb-16 shadow-lg border-2 border-wonderleaf/20 hover:border-wonderleaf transition-colors duration-300 cursor-pointer relative overflow-hidden">
              <div className="w-14 h-14 bg-gradient-to-br from-wonderleaf to-wondergreen rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">🙋‍♀️</span>
              </div>
              <h3 className="font-bold text-wondergreen text-xl mb-2">Volunteer</h3>
              <p className="text-gray-700">Help organize events or lead a club.</p>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 bottom-4 mx-auto text-center text-gray-400 text-base pointer-events-none select-none px-4">
                Thank you for bringing our community to life!
              </span>
            </div>
          </Link>

          {/* Partnership Card */}
          <Link href="/partnership" className="group block">
            <div className="bg-white rounded-xl p-6 pb-16 shadow-lg border-2 border-wonderorange/40 hover:border-wonderorange transition-colors duration-300 cursor-pointer relative overflow-hidden">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 via-wonderorange to-wondersun rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl drop-shadow">🤝</span>
              </div>
              <h3 className="font-bold text-wondergreen text-xl mb-2">Partnership</h3>
              <p className="text-gray-700">Community orgs, let&apos;s create together!</p>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 bottom-4 mx-auto text-center text-gray-400 text-base pointer-events-none select-none px-4">
                Together we can do so much more!
              </span>
            </div>
          </Link>

          {/* Donate Card */}
          <Link href="/support" className="group block">
            <div className="bg-white rounded-xl p-6 pb-16 shadow-lg border-2 border-wondergreen/20 hover:border-wondergreen transition-colors duration-300 cursor-pointer relative overflow-hidden">
              <div className="w-14 h-14 bg-gradient-to-br from-wondergreen to-wonderleaf rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">💚</span>
              </div>
              <h3 className="font-bold text-wondergreen text-xl mb-2">Donate</h3>
              <p className="text-gray-700 mb-3">
                Your support makes our programs possible and is tax-deductible.
              </p>
              <span className="text-wonderorange font-semibold hover:text-wondergreen transition-colors duration-300 underline">
                Support WonderHood →
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 bottom-4 mx-auto text-center text-gray-400 text-base pointer-events-none select-none px-4">
                Every gift counts — thank you for supporting WonderHood!
              </span>
            </div>
          </Link>
        </div>
      </div>


      {/* Contact Footer */}
      <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-wonderleaf/20 max-w-4xl mx-auto">
        <p className="text-lg text-gray-600 mb-4">
          Questions? We&aposd love to hear from you!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="mailto:wonderhood.project@gmail.com" 
            className="text-wonderleaf hover:text-wondergreen font-semibold transition-colors duration-300"
          >
            wonderhood.project@gmail.com
          </a>
          <span className="hidden sm:block text-gray-400">|</span>
          <span className="text-gray-600">Follow us on social media!</span>
        </div>
      </div>
    </div>
  );
}