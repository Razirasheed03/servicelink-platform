import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Wrench, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  Star,
  Phone,
  Mail,
  Zap,
  Droplet,
  Hammer,
  PaintBucket,
  Wind,
  Sparkles,
  ChevronRight,
  Filter,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface ServiceProvider {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  location: string;
  avatar: string;
  available: boolean;
  experience: string;
}

const serviceCategories = [
  { name: 'Electrician', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Plumber', icon: Droplet, color: 'bg-blue-100 text-blue-600' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-amber-100 text-amber-600' },
  { name: 'Painter', icon: PaintBucket, color: 'bg-purple-100 text-purple-600' },
  { name: 'AC Repair', icon: Wind, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Cleaner', icon: Sparkles, color: 'bg-pink-100 text-pink-600' },
];

const providers: ServiceProvider[] = [
  {
    id: 1,
    name: 'John Smith',
    service: 'Electrician',
    rating: 4.8,
    reviews: 127,
    location: 'Downtown Area',
    avatar: '👨‍🔧',
    available: true,
    experience: '8 years'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    service: 'Plumber',
    rating: 4.9,
    reviews: 203,
    location: 'North District',
    avatar: '👨‍🔧',
    available: true,
    experience: '12 years'
  },
  {
    id: 3,
    name: 'Sarah Williams',
    service: 'Carpenter',
    rating: 4.7,
    reviews: 89,
    location: 'East Side',
    avatar: '👩‍🔧',
    available: false,
    experience: '6 years'
  },
  {
    id: 4,
    name: 'David Brown',
    service: 'Painter',
    rating: 4.6,
    reviews: 156,
    location: 'West End',
    avatar: '👨‍🎨',
    available: true,
    experience: '10 years'
  },
  {
    id: 5,
    name: 'Emily Davis',
    service: 'AC Repair',
    rating: 4.9,
    reviews: 178,
    location: 'Central Area',
    avatar: '👩‍🔧',
    available: true,
    experience: '7 years'
  },
  {
    id: 6,
    name: 'Robert Wilson',
    service: 'Cleaner',
    rating: 4.5,
    reviews: 94,
    location: 'South District',
    avatar: '👨‍💼',
    available: true,
    experience: '5 years'
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || provider.service === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ServiceLink
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Services
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                <User className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">{user?.username || 'Profile'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              <button 
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-3">
                <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                  Home
                </a>
                <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                  Services
                </a>
                <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                  About
                </a>
                <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                  Contact
                </a>
                <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                  Profile
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

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
            <span className="font-semibold text-gray-900">{filteredProviders.length}</span> providers available
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Service Providers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Provider Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-3xl">
                      {provider.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-600">{provider.service}</p>
                    </div>
                  </div>
                  {provider.available && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Available
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{provider.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({provider.reviews} reviews)</span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wrench className="w-4 h-4" />
                    <span>{provider.experience} experience</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProviders.length === 0 && (
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