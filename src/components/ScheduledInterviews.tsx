import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Play,
  Eye,
  Copy,
  Check,
  Video,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { mockInterviews } from "../data/mock";
import type { Interview } from "@/interfaces/interview";

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "in-progress" | "completed"
  >("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setInterviews(mockInterviews as Interview[]);
    setFilteredInterviews(mockInterviews as Interview[]);
  }, []);

  useEffect(() => {
    let filtered = [...interviews];

    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter((interview) =>
        [
          interview.candidateName,
          interview.candidateEmail,
          interview.position,
        ].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    // Date Filter
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const getDate = (d: string) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
      };

      if (dateFilter === "today") {
        filtered = filtered.filter(
          (i) => getDate(i.scheduledDate).getTime() === today.getTime()
        );
      } else if (dateFilter === "week") {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        filtered = filtered.filter(
          (i) =>
            getDate(i.scheduledDate) >= today &&
            getDate(i.scheduledDate) <= weekFromNow
        );
      } else if (dateFilter === "month") {
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(today.getMonth() + 1);
        filtered = filtered.filter(
          (i) =>
            getDate(i.scheduledDate) >= today &&
            getDate(i.scheduledDate) <= monthFromNow
        );
      }
    }

    setFilteredInterviews(filtered);
  }, [interviews, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "in-progress":
        return "bg-green-100 text-green-700 border-green-300";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-3 w-3" />;
      case "in-progress":
        return <Play className="h-3 w-3" />;
      case "completed":
        return <Check className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Interview link copied successfully",
    });
  };

  const handleJoinInterview = (interview: Interview) => {
    toast({
      title: "Joining interview",
      description: `Opening interview room for ${interview.candidateName}`,
    });
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scheduled Interviews
          </h1>
          <p className="text-gray-600">
            Manage and monitor all your scheduled interviews
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {filteredInterviews.length} interviews
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(val) =>
                  setStatusFilter(val as typeof statusFilter)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Date Range
              </label>
              <Select
                value={dateFilter}
                onValueChange={(val) => setDateFilter(val as typeof dateFilter)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <Card
            key={interview.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white font-semibold flex items-center justify-center">
                    {interview.candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold">{interview.candidateName}</h3>
                    <p className="text-sm text-gray-600">
                      {interview.candidateEmail}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {interview.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(interview.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {interview.scheduledTime} ({interview.duration})
                      </span>
                    </div>
                  </div>

                  <Badge
                    className={`${getStatusColor(
                      interview.status
                    )} flex items-center space-x-1`}
                  >
                    {getStatusIcon(interview.status)}
                    <span className="capitalize">{interview.status}</span>
                  </Badge>

                  <div className="flex items-center space-x-2">
                    {interview.status === "scheduled" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleJoinInterview(interview)}
                      >
                        <Video className="h-4 w-4 mr-1" /> Join
                      </Button>
                    )}
                    {interview.status === "in-progress" && (
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleJoinInterview(interview)}
                      >
                        <Play className="h-4 w-4 mr-1" /> Continue
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(interview.roomLink, interview.id)
                      }
                    >
                      {copiedId === interview.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Interview Details */}
              <div className="mt-4 pt-4 border-t text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Skills:</strong> {interview.skills.join(", ")}
                </div>
                <div>
                  <strong>Experience:</strong> {interview.experience}
                </div>
                <div>
                  <strong>Room Password:</strong>{" "}
                  <span className="font-mono">{interview.roomPassword}</span>
                </div>
              </div>

              {interview.questions.length > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  <strong>Questions Preview:</strong>{" "}
                  {interview.questions.slice(0, 2).join(", ")}...
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredInterviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No interviews found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or schedule a new interview
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScheduledInterviews;
