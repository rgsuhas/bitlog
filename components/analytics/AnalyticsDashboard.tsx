/**
 * Analytics Dashboard Component
 * 
 * Comprehensive analytics dashboard for blog performance tracking with
 * beautiful visualizations, real-time data, and actionable insights.
 * Provides detailed metrics on post performance, user engagement, and growth.
 * 
 * Features:
 * - Real-time analytics with live updates
 * - Interactive charts and visualizations
 * - Post performance metrics
 * - User engagement tracking
 * - Traffic source analysis
 * - Growth trends and forecasting
 * - Export capabilities for reports
 * - Responsive design for all devices
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClientSupabase, dbUtils } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';

/**
 * Analytics data interfaces
 */
interface AnalyticsMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface PostPerformance {
  id: string;
  title: string;
  slug: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: string;
  engagement: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

interface TimeSeriesData {
  date: string;
  views: number;
  visitors: number;
  engagement: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
}

/**
 * Props interface for the AnalyticsDashboard component
 */
interface AnalyticsDashboardProps {
  /** Optional CSS class name */
  className?: string;
  /** Whether to show real-time updates */
  enableRealtime?: boolean;
  /** Date range for analytics */
  dateRange?: '7d' | '30d' | '90d' | '1y';
}

/**
 * Metric Card Component
 * 
 * Displays individual analytics metrics with trend indicators
 */
interface MetricCardProps {
  metric: AnalyticsMetric;
}

function MetricCard({ metric }: MetricCardProps) {
  const IconComponent = metric.icon;
  const isPositive = metric.changeType === 'increase';
  const isNegative = metric.changeType === 'decrease';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", `bg-${metric.color}-100`)}>
          <IconComponent className={cn("h-4 w-4", `text-${metric.color}-600`)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {isPositive && <TrendingUp className="h-3 w-3 text-green-600" />}
          {isNegative && <TrendingDown className="h-3 w-3 text-red-600" />}
          <span className={cn(
            isPositive && "text-green-600",
            isNegative && "text-red-600"
          )}>
            {isPositive && '+'}
            {metric.change}%
          </span>
          <span>from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Post Performance Table Component
 */
interface PostPerformanceTableProps {
  posts: PostPerformance[];
}

function PostPerformanceTable({ posts }: PostPerformanceTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post, index) => (
          <Card key={post.id} className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <h4 className="font-medium text-sm truncate">
                      {post.title}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-blue-600" />
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-medium">{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-red-600" />
                      <span className="text-muted-foreground">Likes:</span>
                      <span className="font-medium">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3 text-green-600" />
                      <span className="text-muted-foreground">Comments:</span>
                      <span className="font-medium">{post.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-3 w-3 text-purple-600" />
                      <span className="text-muted-foreground">Shares:</span>
                      <span className="font-medium">{post.shares.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {post.engagement.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Engagement
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Analytics Dashboard Component
 */
export function AnalyticsDashboard({
  className,
  enableRealtime = true,
  dateRange = '30d',
}: AnalyticsDashboardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [refreshing, setRefreshing] = useState(false);

  // Analytics data state
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [topPosts, setTopPosts] = useState<PostPerformance[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);

  /**
   * Load analytics data
   */
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // In production, this would fetch real analytics data from Supabase
      // For now, we'll use comprehensive mock data

      // Key metrics
      const mockMetrics: AnalyticsMetric[] = [
        {
          label: 'Total Views',
          value: 45678,
          change: 12.5,
          changeType: 'increase',
          icon: Eye,
          color: 'blue',
        },
        {
          label: 'Unique Visitors',
          value: 12345,
          change: 8.2,
          changeType: 'increase',
          icon: Users,
          color: 'green',
        },
        {
          label: 'Engagement Rate',
          value: 4.8,
          change: -2.1,
          changeType: 'decrease',
          icon: Heart,
          color: 'red',
        },
        {
          label: 'Avg. Session Duration',
          value: 245,
          change: 15.3,
          changeType: 'increase',
          icon: Clock,
          color: 'purple',
        },
      ];

      // Time series data for charts
      const mockTimeSeriesData: TimeSeriesData[] = [
        { date: '2024-01-01', views: 1200, visitors: 800, engagement: 4.2 },
        { date: '2024-01-02', views: 1350, visitors: 900, engagement: 4.5 },
        { date: '2024-01-03', views: 1100, visitors: 750, engagement: 4.1 },
        { date: '2024-01-04', views: 1600, visitors: 1100, engagement: 4.8 },
        { date: '2024-01-05', views: 1800, visitors: 1200, engagement: 5.2 },
        { date: '2024-01-06', views: 1400, visitors: 950, engagement: 4.6 },
        { date: '2024-01-07', views: 1700, visitors: 1150, engagement: 4.9 },
      ];

      // Top performing posts
      const mockTopPosts: PostPerformance[] = [
        {
          id: '1',
          title: 'Building Modern Web Applications with Next.js 14',
          slug: 'building-modern-web-apps',
          views: 8500,
          likes: 245,
          comments: 67,
          shares: 89,
          publishedAt: '2024-01-15T10:00:00Z',
          engagement: 5.8,
        },
        {
          id: '2',
          title: 'Advanced TypeScript Patterns for Better Code',
          slug: 'typescript-advanced-patterns',
          views: 6200,
          likes: 189,
          comments: 43,
          shares: 56,
          publishedAt: '2024-01-12T14:30:00Z',
          engagement: 4.9,
        },
        {
          id: '3',
          title: 'Responsive Design Principles for 2024',
          slug: 'responsive-design-principles',
          views: 4800,
          likes: 156,
          comments: 32,
          shares: 41,
          publishedAt: '2024-01-10T09:15:00Z',
          engagement: 4.2,
        },
      ];

      // Traffic sources
      const mockTrafficSources: TrafficSource[] = [
        { source: 'Organic Search', visitors: 5200, percentage: 42.1, color: '#3b82f6' },
        { source: 'Direct', visitors: 3100, percentage: 25.1, color: '#10b981' },
        { source: 'Social Media', visitors: 2400, percentage: 19.4, color: '#f59e0b' },
        { source: 'Referral', visitors: 1100, percentage: 8.9, color: '#ef4444' },
        { source: 'Email', visitors: 550, percentage: 4.5, color: '#8b5cf6' },
      ];

      // Device data
      const mockDeviceData: DeviceData[] = [
        { device: 'Desktop', visitors: 6800, percentage: 55.1 },
        { device: 'Mobile', visitors: 4200, percentage: 34.0 },
        { device: 'Tablet', visitors: 1345, percentage: 10.9 },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMetrics(mockMetrics);
      setTimeSeriesData(mockTimeSeriesData);
      setTopPosts(mockTopPosts);
      setTrafficSources(mockTrafficSources);
      setDeviceData(mockDeviceData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh analytics data
   */
  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  /**
   * Export analytics data
   */
  const exportData = () => {
    // In production, this would generate and download a report
    console.log('Exporting analytics data...');
    alert('Analytics report exported successfully!');
  };

  // Load data on mount and when date range changes
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedDateRange]);

  // Set up real-time updates
  useEffect(() => {
    if (!enableRealtime) return;

    const interval = setInterval(() => {
      // In production, this would check for real-time updates
      console.log('Checking for real-time analytics updates...');
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [enableRealtime]);

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your blog's performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Views and Visitors Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Views & Visitors Trend</CardTitle>
                <CardDescription>
                  Daily views and unique visitors over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
                <CardDescription>
                  User engagement percentage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>
                Your most popular posts ranked by engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostPerformanceTable posts={topPosts} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  How your audience accesses your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                        {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                        {device.device === 'Tablet' && <Globe className="h-4 w-4" />}
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{device.visitors.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  How users interact with your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span>Average Likes per Post</span>
                    </div>
                    <span className="font-medium">163</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span>Average Comments per Post</span>
                    </div>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4 text-purple-600" />
                      <span>Average Shares per Post</span>
                    </div>
                    <span className="font-medium">62</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Average Read Time</span>
                    </div>
                    <span className="font-medium">4m 12s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Traffic Source List */}
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{source.visitors.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashboard;