/**
 * Analytics Dashboard Component
 * 
 * A comprehensive analytics dashboard that displays post performance,
 * user engagement, and real-time metrics. Provides interactive charts
 * and detailed insights for content creators.
 * 
 * Features:
 * - Real-time metrics display
 * - Interactive charts and graphs
 * - Post performance comparison
 * - Engagement analytics
 * - User behavior insights
 * - Export capabilities
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  getAnalyticsSummary, 
  getAnalyticsChartData, 
  getRealTimeAnalytics,
  type AnalyticsSummary,
  type PostAnalytics
} from '@/lib/analytics';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  MessageSquare,
  Users,
  Clock,
  BarChart3,
  Download,
  RefreshCw,
  Calendar,
  Activity
} from 'lucide-react';

interface AnalyticsDashboardProps {
  className?: string;
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedPost, setSelectedPost] = useState<string>('all');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  useEffect(() => {
    // Set up real-time updates
    const interval = setInterval(() => {
      loadRealTimeData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [summaryData, chartDataResult] = await Promise.all([
        getAnalyticsSummary({ period }),
        getAnalyticsChartData({ period })
      ]);
      
      setSummary(summaryData);
      setChartData(chartDataResult);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const data = await getRealTimeAnalytics();
      setRealTimeData(data);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthIcon = (rate: number) => {
    return rate >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your content performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {realTimeData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Real-time Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Active Users:</span>
                <span className="font-semibold">{realTimeData.activeUsers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Current Views:</span>
                <span className="font-semibold">{realTimeData.currentViews}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalViews)}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {getGrowthIcon(summary.growthRate)}
                <span>{Math.abs(summary.growthRate * 100).toFixed(1)}% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalPosts}</div>
              <div className="text-xs text-muted-foreground">
                {summary.averageViewsPerPost.toFixed(1)} avg views per post
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalEngagement)}</div>
              <div className="text-xs text-muted-foreground">
                Likes, shares, and comments
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(summary.growthRate * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">
                {period} over {period}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Views Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData?.viewsOverTime ? (
                  <div className="h-64 flex items-end justify-between space-x-1">
                    {chartData.viewsOverTime.slice(-7).map((item: any, index: number) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                          className="w-8 bg-primary rounded-t"
                          style={{ height: `${(item.views / Math.max(...chartData.viewsOverTime.map((d: any) => d.views))) * 200}px` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData?.eventTypes ? (
                  <div className="space-y-4">
                    {chartData.eventTypes.map((event: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {event.type === 'view' && <Eye className="h-4 w-4 text-blue-500" />}
                          {event.type === 'like' && <Heart className="h-4 w-4 text-red-500" />}
                          {event.type === 'share' && <Share2 className="h-4 w-4 text-green-500" />}
                          {event.type === 'comment' && <MessageSquare className="h-4 w-4 text-orange-500" />}
                          <span className="capitalize">{event.type}</span>
                        </div>
                        <span className="font-semibold">{formatNumber(event.count)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {summary?.topPerformingPosts ? (
                <div className="space-y-4">
                  {summary.topPerformingPosts.map((post, index) => (
                    <div key={post.postId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{formatNumber(post.views)} views</span>
                            <span>{post.engagementRate.toFixed(1)}% engagement</span>
                            <span>{post.averageTimeOnPage} min read</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No posts data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {summary?.topPerformingPosts.reduce((sum, post) => sum + post.likes, 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Likes</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Share2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {summary?.topPerformingPosts.reduce((sum, post) => sum + post.shares, 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Shares</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {summary?.topPerformingPosts.reduce((sum, post) => sum + post.comments, 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {summary?.recentActivity && summary.recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {summary.recentActivity.slice(0, 10).map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center space-x-2">
                        {event.eventType === 'view' && <Eye className="h-4 w-4 text-blue-500" />}
                        {event.eventType === 'like' && <Heart className="h-4 w-4 text-red-500" />}
                        {event.eventType === 'share' && <Share2 className="h-4 w-4 text-green-500" />}
                        {event.eventType === 'comment' && <MessageSquare className="h-4 w-4 text-orange-500" />}
                        <span className="capitalize text-sm">{event.eventType}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}