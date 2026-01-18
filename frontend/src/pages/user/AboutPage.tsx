import UserNavbar from "@/components/user/UserNavbar";
import { Wrench, Users, ShieldCheck, MapPin } from "lucide-react";
import { useEffect, useState } from "react";


export default function AboutPage() {
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    setUser(JSON.parse(authUser));
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-50">
<UserNavbar user={user || undefined} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About ServiceLink
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting customers with trusted local professionals for everyday services,
            quickly and reliably.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to simplify service discovery by bringing verified professionals
            and users onto a single, easy-to-use platform. Whether it is electrical work,
            plumbing, cleaning, or repairs, ServiceLink helps users find the right expert
            without delays or uncertainty.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Users className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Customer First</h3>
            <p className="text-gray-600 text-sm">
              We prioritize transparency, ease of use, and reliable service experiences
              for every customer.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Trusted Providers</h3>
            <p className="text-gray-600 text-sm">
              Service providers are onboarded carefully to ensure professionalism,
              skill quality, and accountability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <MapPin className="w-8 h-8 text-rose-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Local Reach</h3>
            <p className="text-gray-600 text-sm">
              We focus on connecting users with nearby experts, ensuring faster response
              times and better service availability.
            </p>
          </div>

        </div>

        {/* Why Choose Us */}
        <div className="bg-blue-600 rounded-2xl text-white p-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">Why Choose ServiceLink?</h2>
          <p className="max-w-3xl mx-auto text-blue-100 leading-relaxed">
            ServiceLink bridges the gap between users and skilled professionals by offering
            a transparent, reliable, and location-based service marketplace. Our goal is
            to reduce service delays, eliminate guesswork, and build long-term trust.
          </p>
        </div>

      </div>
    </div>
  );
}
