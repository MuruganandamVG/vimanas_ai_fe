import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Play,
  Plus,
  TrendingUp,
  Star,
} from "lucide-react";

import { dashboardAPI, interviewsAPI } from "@/services/api";

type Stats = {
  total_interviews: number;
  scheduled_interviews: number;
  completed_interviews: number;
  active_interviews: number;
  this_week_interviews: number;
  average_rating: number;
};

type Interview = {
  id: string | number;
  candidate_name: string;
  candidate_email: string;
  position: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: string;
  status: string;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total_interviews: 0,
    scheduled_interviews: 0,
    completed_interviews: 0,
    active_interviews: 0,
    this_week_interviews: 0,
    average_rating: 0,
  });
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats and recent interviews in parallel
      const [statsResponse, interviewsResponse] = await Promise.all([
        dashboardAPI.getStats(),
        interviewsAPI.getAll(),
      ]);

      setStats(statsResponse);
      setRecentInterviews(interviewsResponse.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  type StatCardProps = {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    trend?: string;
  };

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <Button
          onClick={() => navigate("/create")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Interviews"
          value={stats.total_interviews}
          icon={Users}
          color="bg-blue-500"
          trend={`+${stats.this_week_interviews} this week`}
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled_interviews}
          icon={Calendar}
          color="bg-green-500"
          trend="Active bookings"
        />
        <StatCard
          title="Completed"
          value={stats.completed_interviews}
          icon={CheckCircle}
          color="bg-purple-500"
          trend="Successfully finished"
        />
        <StatCard
          title="Average Rating"
          value={stats.average_rating}
          icon={Star}
          color="bg-yellow-500"
          trend="Performance metric"
        />
      </div>

      {/* Recent Interviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Interviews</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/scheduled")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {interview.candidate_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {interview.candidate_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {interview.candidate_email}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {interview.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(interview.scheduled_date)} at{" "}
                        {interview.scheduled_time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {interview.duration}
                      </p>
                    </div>

                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status.charAt(0).toUpperCase() +
                        interview.status.slice(1)}
                    </Badge>

                    {interview.status === "in-progress" && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <p>No recent interviews found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/upload")}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Resume</h3>
            <p className="text-sm text-gray-600">
              Upload candidate resume and start the interview process
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/create")}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Create Interview
            </h3>
            <p className="text-sm text-gray-600">
              Schedule a new interview with generated questions
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/scheduled")}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">View Scheduled</h3>
            <p className="text-sm text-gray-600">
              Manage all your scheduled interviews
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
