import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '@/services/userService';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Star,
  MessageSquare,
  Award,
  ArrowLeft
} from 'lucide-react';
import UserNavbar from '@/components/user/UserNavbar';
import { useNavigate } from "react-router-dom";


interface ServiceProviderProfile {
  username: string;
  email: string;
  phone: string;
  serviceType: string;
  experience: number;
  profileImg?: string;
  location?: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment?: string;
  date: string;
	isOwner: boolean;
	reply?: {
		comment: string;
		date: string;
	};
}

const ServiceProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewModalMode, setReviewModalMode] = useState<'create' | 'edit'>('create');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [provider, setProvider] = useState<ServiceProviderProfile>({
    username: '',
    email: '',
    phone: 'Not available',
    serviceType: 'Not available',
    experience: 0,
    location: 'Not available',
    rating: 4.8,
    totalReviews: 24,
    completedJobs: 42,
  });
  const [, setLoading] = useState<boolean>(true);

  const fetchReviews = async (providerId: string) => {
    const res = await userService.getReviewsByProvider(providerId);
    if (!res?.success || !res.data) {
      setReviews([]);
      return;
    }
    setReviews(res.data.reviews || []);
    setProvider((prev) => ({
      ...prev,
      rating: res.data.avgRating,
      totalReviews: res.data.total,
    }));
  };

  useEffect(() => {
    let active = true;
    const fetchProvider = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await userService.getProviderById(id);
        if (!active) return;
        if (res?.success && res.data?.provider) {
          const p = res.data.provider;
          const view: ServiceProviderProfile = {
            username: p.username || '',
            email: p.email || '',
            phone: p.phone || 'Not available',
            serviceType: p.serviceType || 'Not available',
            experience: typeof p.experience === 'number' ? p.experience : 0,
            location: p.location || 'Not available',
            // keep dummy for rating/reviews as requested
            rating: 4.8,
            totalReviews: 24,
            completedJobs: 42,
          };
          setProvider(view);
        } else {
          setProvider({
            username: '',
            email: '',
            phone: 'Not available',
            serviceType: 'Not available',
            experience: 0,
            location: 'Not available',
            rating: 4.8,
            totalReviews: 24,
            completedJobs: 42,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProvider();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchReviews(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id) return;
    if (!userRating) return;

    try {
      if (reviewModalMode === 'edit' && editingReviewId) {
        const res = await userService.editReview(editingReviewId, {
          rating: userRating,
          comment: feedback,
        });
        if (!res?.success) {
          toast.error(res?.message || 'Failed to edit review');
          return;
        }
        toast.success('Review updated');
      } else {
        const res = await userService.addReview({
          providerId: id,
          rating: userRating,
          comment: feedback,
        });
        if (!res?.success) {
          toast.error(res?.message || 'Failed to submit review');
          return;
        }
        toast.success('Review submitted');
      }

      setShowRatingModal(false);
      setUserRating(0);
      setFeedback('');
      setEditingReviewId(null);
      setReviewModalMode('create');
      await fetchReviews(id);
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? (hoverRating || userRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };
const [user, setUser] = useState<any>(null);

useEffect(() => {
  const authUser = localStorage.getItem("auth_user");
  if (authUser) {
    setUser(JSON.parse(authUser));
  }
}, []);
const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <UserNavbar user={user || undefined} />

      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
        <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
>
  <ArrowLeft className="w-5 h-5" />
  <span className="font-medium">Back to Search</span>
</button>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Provider Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8 border border-white/40">
          {/* Cover Section */}
          <div className="h-32 md:h-40 bg-linear-to-r from-blue-500 to-indigo-600"></div>

          {/* Profile Content */}
          <div className="px-6 md:px-8 pb-8">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                  </div>
                </div>

                {/* Name, Service Type, and Rating */}
                <div className="mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {provider.username}
                  </h1>
                  <p className="text-lg text-indigo-600 font-semibold capitalize">
                    {provider.serviceType}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(provider.rating)}
                    <span className="text-gray-700 font-semibold">{provider.rating}</span>
                    <span className="text-gray-500 text-sm">
                      ({provider.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 mb-4">
                <button
                  onClick={() => {
                    const mine = reviews.find((r) => r.isOwner);
                    if (mine) {
                      setReviewModalMode('edit');
                      setEditingReviewId(mine.id);
                      setUserRating(mine.rating);
                      setFeedback(mine.comment || '');
                    } else {
                      setReviewModalMode('create');
                      setEditingReviewId(null);
                      setUserRating(0);
                      setFeedback('');
                    }
                    setShowRatingModal(true);
                  }}
                  className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl hover:bg-indigo-50 transition font-medium"
                >
                  {reviews.some((r) => r.isOwner) ? 'Edit Review' : 'Write Review'}
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <p className="text-2xl font-bold text-indigo-700">{provider.experience}</p>
                </div>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl font-bold text-indigo-700">{provider.rating}</p>
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Professional Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-white/40">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                Contact Information
              </h2>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm text-gray-800 font-medium break-all">
                      {provider.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm text-gray-800 font-medium">{provider.phone}</p>
                  </div>
                </div>

                {/* Location */}
                {provider.location && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-sm text-gray-800 font-medium">{provider.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-white/40">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Professional Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Service Type</span>
                  <span className="text-sm font-semibold text-gray-800 capitalize">
                    {provider.serviceType}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {provider.experience} Years
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-white h-full rounded-3xl shadow-lg p-6 border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-700">
                    {provider.totalReviews} Reviews
                  </span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{review.userName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      {review.isOwner ? (
                        <button
                          onClick={() => {
                            setReviewModalMode('edit');
                            setEditingReviewId(review.id);
                            setUserRating(review.rating);
                            setFeedback(review.comment || '');
                            setShowRatingModal(true);
                          }}
                          className="text-xs px-3 py-1 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                        >
                          Edit
                        </button>
                      ) : null}
                    </div>
                    {review.comment ? (
                      <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                    ) : null}
                    {review.reply ? (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="text-xs font-semibold text-gray-700">Provider reply</div>
                        <div className="text-xs text-gray-500 mt-1">{review.reply.date}</div>
                        <div className="text-sm text-gray-700 mt-2">{review.reply.comment}</div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h2>
            
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate this service provider
              </label>
              <div className="flex gap-2">
                {renderStars(userRating, true)}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You rated {userRating} out of 5 stars
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with this service provider..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setUserRating(0);
                  setFeedback('');
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:opacity-90 transition font-medium shadow-md"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDetailPage;