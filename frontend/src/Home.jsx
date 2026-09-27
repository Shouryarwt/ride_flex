import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Bike, CarFront, ChevronRight, MapPin, ShieldCheck,
  Sparkles, Star, Zap
} from 'lucide-react';

const fleet = [
  { title: 'Two Wheelers', copy: 'Scooters, commuters and performance bikes for city escapes.', icon: Bike, tag: 'From ₹499/day' },
  { title: 'Four Wheelers', copy: 'Premium hatchbacks, sedans and SUVs for every journey.', icon: CarFront, tag: 'From ₹1,499/day' },
];

const highlights = [
  ['Verified partners', 'GST and identity checks for trusted rentals.'],
  ['Flexible pickup', 'Pickup or doorstep delivery, wherever available.'],
  ['Journey intelligence', 'Discover food, places and your next route as you travel.'],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090b] text-white overflow-hidden">
      <section className="relative min-h-[760px] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(212,175,55,.18),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(70,80,100,.18),transparent_35%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs uppercase tracking-[.25em] text-white/70">
              <Sparkles size={14} className="text-amber-300" /> The premium way to move
            </div>
            <h1 className="mt-8 text-6xl md:text-8xl font-semibold tracking-[-.06em] leading-[.9]">
              Your journey.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600">Your Flex.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg md:text-xl leading-8 text-white/60">
              Discover verified two-wheelers and four-wheelers, reserve in minutes, and let Ride Flex turn every destination into your next experience.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/auth" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-black px-7 py-4 font-semibold hover:bg-amber-100 transition">
                Explore the fleet <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/auth" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[.04] px-7 py-4 font-semibold hover:bg-white/[.08] transition">
                Become a verified partner
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl">
            {highlights.map(([title, copy], i) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[.035] backdrop-blur-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-400/10 text-amber-300 grid place-items-center">
                    {i === 0 ? <ShieldCheck size={18} /> : i === 1 ? <MapPin size={18} /> : <Zap size={18} />}
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/50">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fleet" className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[.25em] text-amber-300">Choose your way</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Built for every kind of ride.</h2>
          </div>
          <p className="max-w-md text-white/45 leading-7">From a quick city run to a mountain weekend, choose the machine that fits the moment.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {fleet.map(({ title, copy, icon: Icon, tag }) => (
            <Link key={title} to="/auth" className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.08] to-white/[.02] p-8">
              <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl group-hover:bg-amber-300/20 transition" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 grid place-items-center">
                    <Icon size={28} className="text-amber-300" />
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55">{tag}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold">{title}</h3>
                  <p className="mt-3 max-w-md text-white/45 leading-7">{copy}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
                    Explore category <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="experience" className="border-y border-white/10 bg-white/[.025]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-[1.1fr_.9fr] gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[.25em] text-amber-300">More than a rental</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-[-.04em]">The destination is part of the ride.</h2>
            <p className="mt-6 text-white/50 leading-8 max-w-xl">
              Ride Flex connects your rental with local discovery — authentic food, nearby places and route ideas shaped around where you have been and where you want to go next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/60">
              {['Local food', 'Scenic routes', 'Tourist spots', 'Ride history', 'Smart suggestions'].map((x) => (
                <span key={x} className="rounded-full border border-white/10 px-4 py-2">{x}</span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#0d0f12] p-6 shadow-2xl">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-200/20 via-transparent to-white/[.03] p-7 min-h-[300px]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[.2em] text-white/40">Recommended near you</span>
                <Star size={16} className="text-amber-300" />
              </div>
              <div className="mt-16">
                <p className="text-sm text-white/40">Next ride</p>
                <h3 className="mt-2 text-3xl font-semibold">Dehradun → Mussoorie</h3>
                <div className="mt-5 flex items-center gap-2 text-white/50 text-sm"><MapPin size={15} /> Scenic mountain route · 34 km</div>
              </div>
              <div className="mt-8 h-px bg-white/10" />
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-white/40">Local discovery included</span>
                <span className="text-amber-300 text-sm font-semibold">View route →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col sm:flex-row gap-4 justify-between text-sm text-white/35">
        <span>© {new Date().getFullYear()} Ride Flex</span>
        <span>Smart Renting for Smarter Travel.</span>
      </footer>
    </main>
  );
}
