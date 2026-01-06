import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Wrench, 
  Search, 
  MapPin, 
  Zap,
  Droplet,
  Hammer,
  PaintBucket,
  Wind,
  Sparkles,
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';
import userService from "@/services/userService";
import UserNavbar from '@/components/user/UserNavbar';

interface BackendProvider {
  _id: string;
  username: string;
  email: string;
  serviceType?: string;
  location?: string;
  experience?: number;
}

const serviceCategories = [
  { name: 'Electrician', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Plumber', icon: Droplet, color: 'bg-blue-100 text-blue-600' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-amber-100 text-amber-600' },
  { name: 'Painter', icon: PaintBucket, color: 'bg-purple-100 text-purple-600' },
  { name: 'AC Repair', icon: Wind, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Cleaner', icon: Sparkles, color: 'bg-pink-100 text-pink-600' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState<any>(null);
  const [providers, setProviders] = useState<BackendProvider[]>([]);
  const [, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authUser = localStorage.getItem('auth_user');
    const authToken = localStorage.getItem('auth_token');

    if (!authUser || !authToken) {
      toast.error('Please login first');
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(authUser));
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceTypeParam = selectedCategory !== 'All' ? selectedCategory.toLowerCase() : undefined;
        const res = await userService.getProviders({
          search: searchQuery || undefined,
          serviceType: serviceTypeParam,
          page: 1,
          limit: 12,
        });
        if (!active) return;
        if (res?.success) {
          setProviders(res.data?.providers || []);
        } else {
          setProviders([]);
        }
      } catch (e) {
        if (active) setProviders([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    const t = setTimeout(fetchData, 300);
    return () => {
      active = false;
      clearTimeout(t);
      controller.abort();
    };
  }, [searchQuery, selectedCategory]);

  const totalCount = providers.length;

  return (
    <div className="min-h-screen bg-gray-50">
    <UserNavbar user={user || undefined} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Find Local Professionals
          </h2>
          <p className="text-gray-600">
            Connect with trusted service providers in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for services or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  selectedCategory === category.name ? 'bg-white/20' : category.color
                }`}>
                  <category.icon className={`w-6 h-6 ${
                    selectedCategory === category.name ? 'text-white' : ''
                  }`} />
                </div>
                <p className={`text-sm font-semibold text-center ${
                  selectedCategory === category.name ? 'text-white' : 'text-gray-700'
                }`}>
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{totalCount}</span> providers available
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Service Providers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Provider Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-3xl">
                      {provider.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{provider.username}</h4>
                      <p className="text-sm text-gray-600">{provider.serviceType}</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.location || 'Not available'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wrench className="w-4 h-4" />
                    <span>{(provider.experience ?? 'Not available')} {provider.experience != null ? 'years' : ''}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => navigate(`/detail/${provider._id}`)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {/* <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                    <Mail className="w-4 h-4" />
                    Message
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {providers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}