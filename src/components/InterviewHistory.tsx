import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  History,
  Search,
  Filter,
  Calendar,
  Clock,
  Star,
  Download,
  Eye,
} from "lucide-react";
import { mockInterviews } from "../data/mock";
import type { Interview } from "@/interfaces/interview"; // Adjust the import path as necessary
// Types

const InterviewHistory: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    const completed = mockInterviews.filter((i) => i.status === "completed");
    setInterviews(completed as Interview[]);
    setFilteredInterviews(completed as Interview[]);
  }, []);

  useEffect(() => {
    let filtered = [...interviews];

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

    if (dateFilter !== "all") {
      const today = new Date();

      const getPastDate = (days: number) => {
        const d = new Date();
        d.setDate(today.getDate() - days);
        return d;
      };

      const getPastMonth = (months: number) => {
        const d = new Date();
        d.setMonth(today.getMonth() - months);
        return d;
      };

      filtered = filtered.filter((interview) => {
        const interviewDate = new Date(interview.scheduledDate);

        switch (dateFilter) {
          case "week":
            return interviewDate >= getPastDate(7) && interviewDate <= today;
          case "month":
            return interviewDate >= getPastMonth(1) && interviewDate <= today;
          case "quarter":
            return interviewDate >= getPastMonth(3) && interviewDate <= today;
          default:
            return true;
        }
      });
    }

    setFilteredInterviews(filtered);
  }, [interviews, searchTerm, statusFilter, dateFilter]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateMockRating = (): string => {
    return (Math.random() * 2 + 3).toFixed(1);
  };

  const generateMockFeedback = (): string => {
    const feedbacks = [
      "Great technical skills, good communication",
      "Strong problem-solving abilities, needs improvement in system design",
      "Excellent cultural fit, solid technical foundation",
      "Good understanding of fundamentals, enthusiastic learner",
      "Impressive portfolio, clear explanations",
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const handleViewDetails = (interview: Interview) => {
    console.log("View details for:", interview);
  };

  const handleDownloadReport = (interview: Interview) => {
    console.log("Download report for:", interview);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Interview History
          </h1>
          <p className="text-gray-600">
            Review completed interviews and performance metrics
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {filteredInterviews.length} completed interviews
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export
              </label>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Cards */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => {
          const rating = generateMockRating();
          const feedback = generateMockFeedback();

          return (
            <Card
              key={interview.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {interview.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {interview.candidateName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {interview.candidateEmail}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {interview.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(interview.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {interview.scheduledTime} ({interview.duration})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{rating}</span>
                      </div>
                    </div>

                    <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                      Completed
                    </Badge>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(interview)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(interview)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Interview Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Skills Assessed
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {interview.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Interview Feedback
                      </h4>
                      <p className="text-sm text-gray-600">{feedback}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Questions Asked
                    </h4>
                    <div className="text-sm text-gray-600">
                      {interview.questions.length} questions • Topics: Technical
                      skills, Problem solving, Culture fit
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredInterviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No completed interviews found
              </h3>
              <p className="text-gray-600">
                Completed interviews will appear here once they're finished
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
