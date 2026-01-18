import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Droplet,
  Hammer,
  PaintBucket,
  Wind,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import UserNavbar from "@/components/user/UserNavbar";

const services = [
  { name: "Electrician", icon: Zap },
  { name: "Plumber", icon: Droplet },
  { name: "Carpenter", icon: Hammer },
  { name: "Painter", icon: PaintBucket },
  { name: "AC Repair", icon: Wind },
  { name: "Cleaning", icon: Sparkles },
];

const faqs = [
  {
    q: "Are service providers verified?",
    a: "Yes. Every provider is manually approved and required to maintain an active subscription.",
  },
  {
    q: "Is there any charge for users?",
    a: "No. Browsing and discovering providers on ServiceLink is completely free.",
  },
  {
    q: "How do I know providers are active?",
    a: "Only providers with an active monthly subscription are visible on the platform.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
<div className="min-h-screen bg-[#f5f9ff] relative overflow-hidden">
  <UserNavbar />

  {/* subtle background accents */}
  <div className="absolute top-[-120px] right-[-120px] w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute top-[180px] left-[-140px] w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
    <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
    <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
      Premium Home Services,
      <br className="hidden sm:block" />
      <span className="text-blue-600"> Simplified</span>
    </h1>

    <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
      ServiceLink helps you discover trusted service professionals
      across India — approved, active, and easy to connect with.
    </p>

    <div className="mt-10 flex justify-center gap-4">
      <button
        onClick={() => navigate("/user/providers")}
        className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200/40"
      >
        Explore Services
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>

    {/* Trust highlights (no fake numbers) */}
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="bg-white/80 backdrop-blur border border-blue-100 rounded-2xl p-6">
        <p className="font-medium text-gray-900">Verified Professionals</p>
        <p className="text-sm text-gray-600 mt-1">
          Providers are manually reviewed and approved before listing.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur border border-blue-100 rounded-2xl p-6">
        <p className="font-medium text-gray-900">Active Subscriptions</p>
        <p className="text-sm text-gray-600 mt-1">
          Only currently active providers are visible on the platform.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur border border-blue-100 rounded-2xl p-6">
        <p className="font-medium text-gray-900">Across India</p>
        <p className="text-sm text-gray-600 mt-1">
          Connecting users with local professionals nationwide.
        </p>
      </div>
    </div>
  </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-14">
            Services We Cover
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {services.map((s) => (
              <div
                key={s.name}
                className="group bg-[#f9fbff] border border-gray-200 rounded-2xl p-6 text-center transition
                           hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100 cursor-pointer"
              >
                <s.icon className="w-8 h-8 text-blue-600 mx-auto mb-3 transition group-hover:scale-110" />
                <p className="font-medium text-gray-800 text-sm">
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#f9fbff]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-16">
            How ServiceLink Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Browse Services", desc: "Explore verified categories and providers." },
              { step: "02", title: "View Provider Details", desc: "See experience, location, and service info." },
              { step: "03", title: "Connect Confidently", desc: "Reach out knowing providers are approved." },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-md transition"
              >
                <p className="text-blue-600 font-semibold text-lg">
                  {item.step}
                </p>
                <h3 className="font-medium text-gray-900 mt-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="px-6 pb-4 text-sm text-gray-600">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
