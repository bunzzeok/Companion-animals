'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Heart, 
  Eye, 
  Calendar,
  Settings,
  LogOut,
  Camera,
  Shield,
  Award,
  MessageCircle
} from 'lucide-react';

// User profile interface
interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone: string;
  userType: 'adopter' | 'provider' | 'admin';
  profileImage?: string;
  address: {
    city: string;
    district: string;
    fullAddress?: string;
  };
  bio?: string;
  isVerified: boolean;
  statistics: {
    petsPosted: number;
    adoptionsCompleted: number;
    profileViews: number;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy: {
      showPhone: boolean;
      showEmail: boolean;
    };
  };
  createdAt: string;
  lastLoginAt?: string;
}

// Recent activity interface
interface RecentActivity {
  _id: string;
  type: 'pet_posted' | 'adoption_request' | 'adoption_completed' | 'profile_updated';
  title: string;
  description: string;
  createdAt: string;
  relatedPet?: {
    _id: string;
    name: string;
    images: string[];
  };
}

// Profile page component - Karrot Market style
export default function ProfilePage() {
  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  // Load profile data
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API calls
      // const profileResponse = await fetch('/api/auth/me');
      // const profileData = await profileResponse.json();
      
      // Mock profile data
      const mockProfile: UserProfile = {
        _id: 'user123',
        email: 'user@example.com',
        name: 'John Doe',
        phone: '010-1234-5678',
        userType: 'provider',
        profileImage: '/placeholder-user.jpg',
        address: {
          city: '서울특별시',
          district: '강남구',
          fullAddress: '서울특별시 강남구 테헤란로 123'
        },
        bio: 'I love helping stray cats find loving homes. Been rescuing and fostering for over 5 years.',
        isVerified: true,
        statistics: {
          petsPosted: 12,
          adoptionsCompleted: 8,
          profileViews: 234
        },
        preferences: {
          notifications: {
            email: true,
            push: true
          },
          privacy: {
            showPhone: false,
            showEmail: false
          }
        },
        createdAt: '2023-01-15T09:00:00Z',
        lastLoginAt: new Date().toISOString()
      };

      const mockActivity: RecentActivity[] = [
        {
          _id: 'activity1',
          type: 'pet_posted',
          title: 'Posted new pet',
          description: 'Posted "Fluffy the Cat" for adoption',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          relatedPet: {
            _id: 'pet1',
            name: 'Fluffy',
            images: ['/placeholder-pet.jpg']
          }
        },
        {
          _id: 'activity2',
          type: 'adoption_completed',
          title: 'Adoption completed',
          description: 'Successfully found a home for "Buddy the Dog"',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          relatedPet: {
            _id: 'pet2',
            name: 'Buddy',
            images: ['/placeholder-pet.jpg']
          }
        },
        {
          _id: 'activity3',
          type: 'adoption_request',
          title: 'New adoption request',
          description: 'Received adoption request for "Mittens"',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          relatedPet: {
            _id: 'pet3',
            name: 'Mittens',
            images: ['/placeholder-pet.jpg']
          }
        }
      ];

      setProfile(mockProfile);
      setRecentActivity(mockActivity);

    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pet_posted': return <Heart className="h-4 w-4 text-blue-500" />;
      case 'adoption_request': return <MessageCircle className="h-4 w-4 text-yellow-500" />;
      case 'adoption_completed': return <Award className="h-4 w-4 text-green-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <Link href="/login" className="text-orange-500 hover:text-orange-600">
            Please log in to view your profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <div className="flex items-center space-x-4">
              <Link 
                href="/profile/edit"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <Link 
                href="/settings"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Profile image */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  {profile.isVerified && (
                    <span title="Verified user">
                      <Shield className="h-5 w-5 text-blue-500 ml-2" />
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 capitalize mb-1">
                  {profile.userType === 'provider' ? 'Pet Provider' : 'Pet Adopter'}
                </p>
                
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.address.district}, {profile.address.city}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <span>Joined {formatDate(profile.createdAt)}</span>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">{profile.statistics.petsPosted}</div>
                  <div className="text-xs text-gray-500">Pets Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">{profile.statistics.adoptionsCompleted}</div>
                  <div className="text-xs text-gray-500">Adoptions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">{profile.statistics.profileViews}</div>
                  <div className="text-xs text-gray-500">Profile Views</div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="space-y-2">
                {profile.userType === 'provider' && (
                  <Link 
                    href="/post-pet"
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center block font-medium"
                  >
                    Post New Pet
                  </Link>
                )}
                <Link 
                  href="/my-pets"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block font-medium"
                >
                  {profile.userType === 'provider' ? 'My Pet Listings' : 'My Adoption Requests'}
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tab navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {['overview', 'activity', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Dashboard cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-orange-500 mb-1">
                      {recentActivity.length}
                    </div>
                    <p className="text-sm text-gray-500">activities this week</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Success Rate</h3>
                      <Award className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {profile.statistics.petsPosted > 0 
                        ? Math.round((profile.statistics.adoptionsCompleted / profile.statistics.petsPosted) * 100)
                        : 0}%
                    </div>
                    <p className="text-sm text-gray-500">adoption success rate</p>
                  </div>
                </div>

                {/* Recent pets or adoptions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {profile.userType === 'provider' ? 'Recent Pet Listings' : 'Recent Adoption Requests'}
                  </h3>
                  <div className="space-y-4">
                    {/* Mock recent items */}
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Heart className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Cute Cat #{index + 1}</h4>
                          <p className="text-sm text-gray-500">Posted 2 days ago</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Available
                            </span>
                            <span className="text-xs text-gray-500">3 requests</span>
                          </div>
                        </div>
                        <Link 
                          href={`/pets/pet-${index + 1}`}
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</span>
                          {activity.relatedPet && (
                            <Link 
                              href={`/pets/${activity.relatedPet._id}`}
                              className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                            >
                              View Pet
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {recentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Calendar className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notification settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900">Email Notifications</label>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.email}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900">Push Notifications</label>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.push}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900">Show Phone Number</label>
                        <p className="text-sm text-gray-500">Make your phone visible to other users</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showPhone}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900">Show Email Address</label>
                        <p className="text-sm text-gray-500">Make your email visible to other users</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showEmail}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Account actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/profile/edit"
                      className="flex items-center px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                    <Link 
                      href="/change-password"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Link>
                    <button className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}