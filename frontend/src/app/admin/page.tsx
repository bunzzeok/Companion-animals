'use client'

import { useState, useEffect, useCallback } from 'react';

// Force dynamic rendering for admin page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  AlertCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Interface definitions for admin data
interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalAdoptions: number;
  pendingReports: number;
  todayRegistrations: number;
  monthlyGrowth: number;
}

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  userType: 'adopter' | 'provider' | 'admin';
  isVerified: boolean;
  status: 'active' | 'suspended' | 'deactivated';
  petsPosted: number;
  adoptionsCompleted: number;
  createdAt: string;
  lastLoginAt?: string;
}

interface PetSummary {
  _id: string;
  name: string;
  type: 'cat' | 'dog' | 'other';
  status: 'available' | 'pending' | 'adopted' | 'removed';
  urgency: 'low' | 'medium' | 'high';
  owner: {
    name: string;
    email: string;
  };
  views: number;
  likes: number;
  reportCount: number;
  createdAt: string;
}

interface ReportItem {
  _id: string;
  type: 'user' | 'pet' | 'adoption';
  reportedBy: {
    name: string;
    email: string;
  };
  targetId: string;
  targetName: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
}

// Admin dashboard component - Professional backoffice style
export default function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pets' | 'reports'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Event handlers
  const handleTabChange = useCallback((tabId: 'overview' | 'users' | 'pets' | 'reports') => {
    setActiveTab(tabId);
  }, []);

  // Load admin data
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API calls
      // Mock data for demonstration
      const mockStats: AdminStats = {
        totalUsers: 1247,
        totalPets: 586,
        totalAdoptions: 342,
        pendingReports: 12,
        todayRegistrations: 23,
        monthlyGrowth: 12.5
      };

      const mockUsers: UserSummary[] = Array.from({ length: 10 }, (_, index) => ({
        _id: `user-${index}`,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        userType: ['adopter', 'provider'][index % 2] as any,
        isVerified: Math.random() > 0.3,
        status: ['active', 'suspended'][index % 8 === 0 ? 1 : 0] as any,
        petsPosted: Math.floor(Math.random() * 10),
        adoptionsCompleted: Math.floor(Math.random() * 5),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastLoginAt: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
      }));

      const mockPets: PetSummary[] = Array.from({ length: 10 }, (_, index) => ({
        _id: `pet-${index}`,
        name: `Pet ${index + 1}`,
        type: ['cat', 'dog', 'other'][index % 3] as any,
        status: ['available', 'pending', 'adopted'][index % 3] as any,
        urgency: ['low', 'medium', 'high'][index % 3] as any,
        owner: {
          name: `Owner ${index + 1}`,
          email: `owner${index + 1}@example.com`
        },
        views: Math.floor(Math.random() * 200),
        likes: Math.floor(Math.random() * 50),
        reportCount: Math.floor(Math.random() * 3),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));

      const mockReports: ReportItem[] = Array.from({ length: 5 }, (_, index) => ({
        _id: `report-${index}`,
        type: ['user', 'pet', 'adoption'][index % 3] as any,
        reportedBy: {
          name: `Reporter ${index + 1}`,
          email: `reporter${index + 1}@example.com`
        },
        targetId: `target-${index}`,
        targetName: `Target ${index + 1}`,
        reason: ['Inappropriate content', 'Fraud', 'Animal abuse', 'False information'][index % 4],
        description: `Report description for item ${index + 1}`,
        status: ['pending', 'reviewing'][index % 2] as any,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

      setStats(mockStats);
      setUsers(mockUsers);
      setPets(mockPets);
      setReports(mockReports);

    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  // Get status badge color
  const getStatusColor = (status: string, type: 'user' | 'pet' | 'report' = 'user') => {
    if (type === 'user') {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'suspended': return 'bg-red-100 text-red-800';
        case 'deactivated': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'pet') {
      switch (status) {
        case 'available': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'adopted': return 'bg-blue-100 text-blue-800';
        case 'removed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'reviewing': return 'bg-blue-100 text-blue-800';
        case 'resolved': return 'bg-green-100 text-green-800';
        case 'dismissed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  // Handle bulk selection
  const handleSelectAll = (items: any[]) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item._id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Companion Animals
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Download className="h-5 w-5" />
              </button>
              <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'pets', label: 'Pets', icon: Heart },
                { id: 'reports', label: 'Reports', icon: AlertCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    {tab.id === 'reports' && reports.filter(r => r.status === 'pending').length > 0 && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {reports.filter(r => r.status === 'pending').length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-green-600 mt-2">
                  +{stats.todayRegistrations} today
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pets</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalPets.toLocaleString()}</p>
                  </div>
                  <Heart className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  {pets.filter(p => p.status === 'available').length} available
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Successful Adoptions</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAdoptions.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-sm text-green-600 mt-2">
                  +{stats.monthlyGrowth}% this month
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm text-red-600 mt-2">
                  Requires attention
                </p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pets</h3>
                <div className="space-y-3">
                  {pets.slice(0, 5).map((pet) => (
                    <div key={pet._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{pet.name}</p>
                          <p className="text-sm text-gray-500">{pet.type} • {pet.owner.name}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.status, 'pet')}`}>
                        {pet.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users header with actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === users.length}
                    onChange={() => handleSelectAll(users)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
                  </span>
                  {selectedItems.length > 0 && (
                    <div className="ml-4 flex items-center space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">Suspend</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(user._id)}
                              onChange={() => handleSelectItem(user._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                            />
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                  {user.isVerified && (
                                    <Shield className="h-4 w-4 text-blue-500 ml-1" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-900">{user.userType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <p>{user.petsPosted} pets posted</p>
                            <p>{user.adoptionsCompleted} adoptions</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pets' && (
          <div className="space-y-6">
            {/* Pets header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Pet Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pets..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Pets table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engagement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reports
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pets.map((pet) => (
                      <tr key={pet._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Heart className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{pet.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{pet.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{pet.owner.name}</p>
                            <p className="text-sm text-gray-500">{pet.owner.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.status, 'pet')}`}>
                            {pet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(pet.urgency)}`}>
                            {pet.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{pet.views}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{pet.likes}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pet.reportCount > 0 ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              {pet.reportCount} reports
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Reports header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Reports Management</h2>
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="all">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Reports list */}
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status, 'report')}`}>
                          {report.status}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">{report.type} Report</span>
                        <span className="text-sm text-gray-500">{formatTimeAgo(report.createdAt)}</span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Report against "{report.targetName}"
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Reported by</p>
                          <p className="text-sm text-gray-900">{report.reportedBy.name}</p>
                          <p className="text-sm text-gray-500">{report.reportedBy.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Reason</p>
                          <p className="text-sm text-gray-900">{report.reason}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-700">{report.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      {report.status === 'pending' && (
                        <>
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            Review
                          </button>
                          <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                            Dismiss
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {reports.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-500">All reports have been resolved or dismissed.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}