'use client';

import Link from "next/link";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function GetInvolved() {
  return (
    <div>
      {/* HEADER */}
      <section className="relative bg-wondergreen bg-gradient-to-br from-wondergreen to-wonderleaf py-16 px-2 text-center text-white shadow-lg overflow-hidden">
        {/* Animated circles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <span className="absolute top-8 left-1/4 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-10 left-1/2 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-12 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-1/3 left-60 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-white/15 animate-pulse-slow" />
          <span className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/10 animate-float" />
          <span className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-10 right-1/3 w-5 h-5 rounded-full bg-white/10 animate-float-slow" />
          <span className="absolute top-1/4 right-60 w-3 h-3 rounded-full bg-white/10 animate-float-slow" />
          <span className="absolute bottom-20 right-80 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-16 right-40 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
        </div>
        {/* Header Content */}
        <div className="relative z-10 font-segoe">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Get Involved with WonderHood
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-0">
            Join our community and help create meaningful learning <br />
            experiences for homeschooling families
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="bg-wonderbg min-h-screen pb-16">
        {/* Intro Text + CARDS */}
        <section className="py-12 max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xl md:text-1xl text-center max-w-4xl mx-auto text-gray-700 mb-12">
            There are many ways to support and participate in our mission to empower families through connection, creativity, and community-based learning. Choose the path that resonates with you!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Volunteer */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer overflow-hidden w-full">
              <div className="absolute left-0 top-0 h-2 w-full bg-wondergreen rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <span className="block w-16 h-16 rounded-full bg-wondergreen flex items-center justify-center text-3xl text-white shrink-0">
                  🙋‍♀️
                </span>
                <h2 className="text-2xl font-bold text-wondergreen">Volunteer</h2>
              </div>
              <p className="text-base text-gray-700 mb-4">
                Share your skills and passions by leading clubs, assisting with events, or mentoring families.
              </p>
              <ul className="mb-4 space-y-1 text-base">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Lead specialized clubs or workshops</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Assist at community events</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Mentor new homeschooling families</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Help with outdoor activities</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support administrative tasks</li>
              </ul>
              <Link 
              href="/volunteer"
              className=" block w-full py-2 rounded-full text-lg font-bold text-white  text-center bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                  Become a Volunteer
              </Link>
            </div>
            {/* Partnership */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer overflow-hidden w-full">
              <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-wonderorange to-wondersun rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <span className="block w-16 h-16 rounded-full bg-gradient-to-br from-wonderorange to-wondersun flex items-center justify-center text-3xl text-white shrink-0">
                  🤝
                </span>
                <h2 className="text-2xl font-bold text-wondergreen">Partnership</h2>
              </div>
              <p className="text-base text-gray-700 mb-4">
                Partner with us as an organization to provide resources, venues, or educational opportunities.
              </p>
              <ul className="mb-4 space-y-1 text-base">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Educational program collaboration</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Venue partnerships for events</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Resource and material sharing</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Expert guest speaking</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Community outreach programs</li>
              </ul>
              <Link
              href="/partnership"
              className="w-full py-2 rounded-full text-lg font-bold text-white text-center bg-gradient-to-r from-wonderorange to-wondersun shadow hover:from-wondersun hover:to-wonderorange transition-colors">
                  Explore Partnership
              </Link>
            </div>
            {/* Make a Donation */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer overflow-hidden w-full">
              <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-wondergreen to-wonderleaf rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <span className="block w-16 h-16 rounded-full bg-gradient-to-br from-wondergreen to-wonderleaf flex items-center justify-center text-3xl text-white shrink-0">
                  💝
                </span>
                <h2 className="text-2xl font-bold text-wondergreen">Make a Donation</h2>
              </div>
              <p className="text-base text-gray-700 mb-4">
                Support our mission with a financial contribution to help us reach more families and expand our programs.
              </p>
              <ul className="mb-4 space-y-1 text-base">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support program development</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Provide scholarships for families</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Fund equipment and materials</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Enable new club creation</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support community events</li>
              </ul>
              <Link 
              href="/support"
              className="w-full py-2 rounded-full text-lg font-bold text-white text-center bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
                  Donate Now
              </Link >
            </div>
          </div>
        </section>

        {/* Become a Sponsor */}
        {/* <div className="relative z-10 font-segoe text-center mt-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Become a Sponsor
          </h1>
          <p className="text-center text-gray-700 text-xl md:text-2xl mb-10">
            Partner with us to make a lasting impact on homeschooling families in our community
          </p>
        </div>

        <section className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6"> */}
            {/* Program Sponsor */}
            {/* <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-[370px] mx-auto">
                <div className="flex items-center w-full justify-center mb-4">
                    <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-4">
                    🎓
                    </span>
                    <div className="flex flex-col justify-center">
                    <span className="text-xl font-semibold text-wondergreen leading-tight">Program Sponsor</span>
                    <span className="text-2xl font-bold text-wondergreen mt-1">$500+</span>
                    </div>
                </div>
                <ul className="mb-3 text-lg text-gray-700 leading-relaxed space-y-2 w-full">
                    <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor clubs or workshops</li>
                    <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Logo on program materials</li>
                    <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Recognition at events</li>
                </ul>
                <div className="italic text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">Your gift helps run our core programs!</div>
            </div> */}

            {/* Event Sponsor */}
            {/* <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-[370px] mx-auto">
                <div className="flex items-center w-full justify-center mb-4">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-4">🎉</span>
                <div className="flex flex-col justify-center">
                    <span className="text-xl font-semibold text-wondergreen leading-tight">Event Sponsor</span>
                    <span className="text-2xl font-bold text-wondergreen mt-1">$1000+</span>
                </div>
                </div>
                <ul className="mb-3 text-lg text-gray-700 leading-relaxed space-y-2 w-full">
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor community events</li>
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Brand visibility at events</li>
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Social media recognition</li>
                </ul>
                <div className="italic text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                Get featured at our biggest events!
                </div>
            </div> */}
            
            {/* Adventure Sponsor */}
            {/* <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-[370px] mx-auto">
                <div className="flex items-center w-full justify-center mb-4">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-4">🏕️</span>
                <div className="flex flex-col justify-center">
                    <span className="text-xl font-semibold text-wondergreen leading-tight">Adventure Sponsor</span>
                    <span className="text-2xl font-bold text-wondergreen mt-1">$1500+</span>
                </div>
                </div>
                <ul className="mb-3 text-lg text-gray-700 leading-relaxed space-y-2 w-full">
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor outdoor adventures</li>
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Brand on adventure gear</li>
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Premium recognition</li>
                </ul>
                <div className="italic text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                Support amazing outdoor experiences!
                </div>
            </div> */}
            
            {/* Creative Sponsor */}
            {/* <div className="group relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-[370px] mx-auto">
                <div className="flex items-center w-full justify-center mb-4">
                <span className="block w-14 h-14 rounded-full bg-wonderleaf/30 flex items-center justify-center text-3xl mr-4">🎨</span>
                <div className="flex flex-col justify-center">
                    <span className="text-xl font-semibold text-wondergreen leading-tight">Creative Sponsor</span>
                    <span className="text-2xl font-bold text-wondergreen mt-1">$750+</span>
                </div>
                </div>
                <ul className="mb-3 text-lg text-gray-700 leading-relaxed space-y-2 w-full">
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Sponsor art programs</li>
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Creative workshop support</li>
                <li className="flex items-start gap-2"><span className="text-wondergreen text-xl">✔</span> Art showcase recognition</li>
                </ul>
                <div className="italic text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                Inspire creativity in young minds!
                </div>
            </div>
            </section> */}

        {/* Call to Action Buttons */}
        {/* <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10">
          <button className="px-10 py-3 rounded-full text-xl font-bold text-white bg-gradient-to-r from-wondergreen to-wonderleaf shadow hover:from-wonderleaf hover:to-wondergreen transition-colors">
            Become a Sponsor
          </button>
          <button className="px-10 py-3 rounded-full text-xl font-bold border-2 border-wondergreen text-wondergreen bg-white hover:bg-wonderleaf/10 flex items-center gap-2 transition-colors">
            <svg width="22" height="25" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><path d="M12 17v-8m0 8l4-4m-4 4l-4-4M20 21a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16z"/></svg>
            Download Sponsor Package
          </button>
        </div> */}
      </main>
    </div>
  );
}
