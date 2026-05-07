"use client";

import { useState } from "react";

const products = [
  { id: 1, label: "P1", bg: "bg-blue-50", text: "text-blue-600" },
  { id: 2, label: "P2", bg: "bg-emerald-50", text: "text-emerald-600" },
  { id: 3, label: "P3", bg: "bg-amber-50", text: "text-amber-600" },
  { id: 4, label: "P4", bg: "bg-pink-50", text: "text-pink-600" },
  { id: 5, label: "P5", bg: "bg-violet-50", text: "text-violet-600" },
];

const col2Sections = [
  {
    title: "Product Overview",
    body: "This premium product is crafted with precision and care. Designed for those who demand excellence in every detail, it combines form and function seamlessly into an experience unlike any other in its class.",
  },
  {
    title: "Key Features",
    body: "Advanced noise-cancelling technology, 40-hour battery life, premium leather ear cushions, foldable design for portability, and multipoint Bluetooth supporting up to 3 devices simultaneously.",
  },
  {
    title: "Technical Specs",
    body: "Driver: 40mm · Frequency: 20Hz–20kHz · Impedance: 32Ω · Sensitivity: 103dB · Weight: 250g · Charging: USB-C · 10 min charge = 3hrs playback.",
  },
  {
    title: "In the Box",
    body: "Headphones, USB-C cable, 3.5mm audio cable, carrying case, airplane adapter, quick start guide and warranty card included with every purchase.",
  },
  {
    title: "Compatibility",
    body: "Works with iOS, Android, Windows, macOS. Supports SBC, AAC, aptX HD codecs. Voice assistant support for Siri, Google Assistant, and Alexa out of the box.",
  },
  {
    title: "Care & Maintenance",
    body: "Wipe with a soft dry cloth. Avoid extreme temperatures and moisture. Store in the carrying case when not in use to preserve the cushions and finish.",
  },
  {
    title: "Warranty",
    body: "2-year limited manufacturer warranty. Extended warranty plans available at checkout. Our 24/7 support team is ready to help with any product concerns.",
  },
  {
    title: "Shipping & Returns",
    body: "Free standard shipping (5–7 days). Express 2-day available. Ships to 60+ countries. 30-day hassle-free returns with no questions asked.",
  },
  {
    title: "Customer Reviews",
    body: "Over 2,300 verified reviews with an average of 4.8 stars. Customers consistently praise the comfort during long listening sessions and the exceptional ANC performance.",
  },
  {
    title: "FAQs",
    body: "Can I use while charging? Yes. Compatible with older Bluetooth? Yes, via 3.5mm cable. Water resistant? IPX4 splash proof. Does it fold flat? Yes, fully foldable.",
  },
];

const plans = [
  {
    id: 1,
    title: "Basic",
    price: "$149",
    desc: "Entry-level package",
    features: ["Free shipping", "Email support", "30-day returns"],
    badge: "Standard",
    cardBorder: "border-gray-200",
    badgeStyle: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    id: 48,
    title: "Basic",
    price: "$149",
    desc: "Entry-level package",
    features: ["Free shipping", "Email support", "30-day returns"],
    badge: "Standard",
    cardBorder: "border-gray-200",
    badgeStyle: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    id: 2,
    title: "Popular",
    price: "$199",
    desc: "Best for most buyers",
    features: ["Priority shipping", "Phone support", "60-day returns"],
    badge: "Most popular",
    cardBorder: "border-blue-300",
    badgeStyle: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 3,
    title: "Bundle",
    price: "$239",
    desc: "Includes case + cables",
    features: ["Express shipping", "Priority support", "90-day returns"],
    badge: "Best value",
    cardBorder: "border-gray-200",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export default function ProductPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [selected, setSelected] = useState<number>(2);
  const selectedPlan = plans.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <span>Home</span>
          <span>/</span>
          <span>Audio</span>
          <span>/</span>
          <span className="text-gray-700">WH-1000XM5</span>
        </div>

        {/* ── MAIN 3-COLUMN LAYOUT ── */}
        <div className="flex gap-8 items-start">
          {/* COL 1: The Fixed Product Image Gallery */}
          <div className="w-60 flex-shrink-0 sticky top-6 self-start">
            <div
              className={`w-full aspect-square rounded-2xl flex items-center justify-center text-5xl font-bold transition-all duration-300 mb-3 ${products[activeImg].bg} ${products[activeImg].text}`}
            >
              {products[activeImg].label}
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${p.bg} ${p.text} ${
                    i === activeImg
                      ? "ring-2 ring-gray-800 ring-offset-1 scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-3.5 h-3.5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">4.8 · 2,341 reviews</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT SIDE WRAPPER: Fixed to scroll Col 2 and 3 together, 
              then lock Col 3 to the bottom.
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 flex gap-10 items-end">
            {/* COL 2: Product Content (Middle) - Flows Naturally */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Sony WH-1000XM5
              </h1>
              <p className="text-sm text-gray-500 mb-8 font-medium">
                Wireless Noise Cancelling Headphones
              </p>

              <div className="space-y-12">
                {col2Sections.map((s, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-12 last:border-0"
                  >
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
                      {s.title}
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {s.body}
                    </p>

                    {i % 4 === 0 && (
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            Industry Leading
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Next-gen performance technology.
                          </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl mb-4 flex items-center justify-center text-emerald-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            Eco-Friendly
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            100% recycled packaging materials.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COL 3: Pricing Cards (Right) - STICKY BOTTOM
                Changed 'items-start' to 'items-end' in wrapper,
                Changed 'sticky top-6 self-start' to 'sticky bottom-6 self-end'.
            */}
            <div className="w-80 flex-shrink-0 sticky bottom-6 ">
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-4">
                Select Edition
              </p>

              <div className="space-y-3">
                {plans.map((plan) => {
                  const isSelected = selected === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelected(plan.id)}
                      className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 focus:outline-none group ${
                        isSelected
                          ? "border-gray-900 bg-gray-900 shadow-2xl scale-[1.02]"
                          : `${plan.cardBorder} bg-white hover:border-gray-300 hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p
                            className={`text-sm font-bold ${isSelected ? "text-white" : "text-gray-900"}`}
                          >
                            {plan.title}
                          </p>
                          <p
                            className={`text-[11px] ${isSelected ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {plan.desc}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-tighter ${
                            isSelected
                              ? "bg-white/10 text-white border-white/20"
                              : plan.badgeStyle
                          }`}
                        >
                          {plan.badge}
                        </span>
                      </div>

                      <p
                        className={`text-2xl font-black mb-4 ${isSelected ? "text-white" : "text-gray-900"}`}
                      >
                        {plan.price}
                      </p>

                      <ul className="space-y-2">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <svg
                              className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-emerald-400" : "text-emerald-500"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span
                              className={`text-[11px] font-medium ${isSelected ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: These stick together with the cards */}
              <div className="mt-6 space-y-3">
                <button className="w-full py-4 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.97] transition-all">
                  Add to Cart — {selectedPlan.price}
                </button>
                <button className="w-full py-4 rounded-2xl text-sm font-bold bg-white text-gray-900 border-2 border-gray-100 hover:border-gray-200 active:scale-[0.97] transition-all">
                  Express Checkout
                </button>
                <div className="flex items-center justify-between px-2 pt-2">
                  <span className="text-[10px] font-semibold text-gray-400">
                    Free 2-day Shipping
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400">
                    Secure Payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
