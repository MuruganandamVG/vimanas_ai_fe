import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";
import { Calendar, Clock, Brain, Copy, Check } from "lucide-react";
import { aiAPI, interviewsAPI, jobDescriptionsAPI } from "../services/api";

const CreateInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    candidate_name: "",
    candidate_email: "",
    position: "",
    skills: "",
    experience: "",
    job_description: "",
    scheduled_date: "",
    scheduled_time: "",
    duration: "45min",
    interview_type: "video",
  });

  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedJd, setSelectedJd] = useState("");
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadJobDescriptions();

    if (location.state?.candidateInfo) {
      const { candidateInfo, resumeFile } = location.state;
      setFormData((prev) => ({
        ...prev,
        candidate_name: candidateInfo.name,
        candidate_email: candidateInfo.email,
        position: candidateInfo.position,
        skills: candidateInfo.skills,
        experience: candidateInfo.experience,
        resumeFile: resumeFile,
      }));
    }
  }, [location.state]);

  const loadJobDescriptions = async () => {
    try {
      const jobDescs = await jobDescriptionsAPI.getAll();
      setJobDescriptions(jobDescs);
    } catch (error) {
      console.error("Error loading job descriptions:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateQuestions = async () => {
    if (!formData.skills || !formData.experience || !formData.job_description) {
      toast({
        title: "Missing information",
        description: "Please fill skills, experience, and job description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim());
      const requestData = {
        skills: skillsArray,
        experience: formData.experience,
        job_description: formData.job_description,
        position: formData.position,
        question_count: 5,
      };

      const response = await aiAPI.generateQuestions(requestData);
      setQuestions(response.questions);

      toast({
        title: "Questions generated successfully",
        description:
          "AI has generated interview questions based on candidate profile",
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error generating questions",
        description:
          error.response?.data?.detail || "Failed to generate questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const scheduleInterview = async () => {
    if (
      !formData.candidate_name ||
      !formData.candidate_email ||
      !formData.scheduled_date ||
      !formData.scheduled_time
    ) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "No questions generated",
        description: "Please generate questions first",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);
    try {
      const interviewData = {
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email,
        position: formData.position,
        job_description: formData.job_description,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        experience: formData.experience,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        duration: formData.duration,
        interview_type: formData.interview_type,
      };

      const newInterview = await interviewsAPI.create(interviewData);

      await interviewsAPI.generateQuestions(newInterview.id);

      setInterviewDetails(newInterview);

      toast({
        title: "Interview scheduled successfully",
        description: "Room link and credentials generated",
      });
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast({
        title: "Error scheduling interview",
        description:
          error.response?.data?.detail || "Failed to schedule interview",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Interview details copied successfully",
    });
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (interviewDetails) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Interview Scheduled Successfully
          </h1>
          <p className="text-gray-600">
            Share these details with the candidate
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Interview Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Candidate
                </Label>
                <p className="text-lg font-semibold">
                  {interviewDetails.candidate_name}
                </p>
                <p className="text-gray-600">
                  {interviewDetails.candidate_email}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Position
                </Label>
                <p className="text-lg font-semibold">
                  {interviewDetails.position}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Date & Time
                </Label>
                <p className="text-lg font-semibold">
                  {interviewDetails.scheduled_date} at{" "}
                  {interviewDetails.scheduled_time}
                </p>
                <p className="text-gray-600">
                  Duration: {interviewDetails.duration}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <p className="text-lg font-semibold text-green-600">
                  Scheduled
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-blue-900">
                  Interview Room Link
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(interviewDetails.room_link)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-blue-700 font-mono text-sm break-all">
                {interviewDetails.room_link}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Label className="text-sm font-medium text-green-900">
                Room Password
              </Label>
              <p className="text-green-700 font-mono text-lg font-semibold">
                {interviewDetails.room_password}
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => navigate("/scheduled")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                View All Interviews
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setInterviewDetails(null);
                  setFormData({
                    candidate_name: "",
                    candidate_email: "",
                    position: "",
                    skills: "",
                    experience: "",
                    job_description: "",
                    scheduled_date: "",
                    scheduled_time: "",
                    duration: "45min",
                    interview_type: "video",
                  });
                  setQuestions([]);
                }}
              >
                Schedule Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Interview</h1>
        <p className="text-gray-600">
          Generate AI questions and schedule interview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Form */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidate_name">Candidate Name *</Label>
                <Input
                  id="candidate_name"
                  value={formData.candidate_name}
                  onChange={(e) =>
                    handleInputChange("candidate_name", e.target.value)
                  }
                  placeholder="Enter candidate name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidate_email">Email Address *</Label>
                <Input
                  id="candidate_email"
                  type="email"
                  value={formData.candidate_email}
                  onChange={(e) =>
                    handleInputChange("candidate_email", e.target.value)
                  }
                  placeholder="candidate@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="React, JavaScript, Node.js, MongoDB..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_description">Job Description</Label>
                <Textarea
                  id="job_description"
                  value={formData.job_description}
                  onChange={(e) =>
                    handleInputChange("job_description", e.target.value)
                  }
                  placeholder="Enter job description and requirements..."
                  rows={4}
                />
              </div>
            </div>

            <Button
              onClick={generateQuestions}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isGenerating
                ? "Generating Questions..."
                : "Generate AI Questions"}
            </Button>
          </CardContent>
        </Card>

        {/* Scheduling & Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule & Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduled_date">Date *</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) =>
                    handleInputChange("scheduled_date", e.target.value)
                  }
                  min={getTomorrowDate()}
                  required
                />
              </div>

              <div>
                <Label htmlFor="scheduled_time">Time *</Label>
                <Input
                  id="scheduled_time"
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) =>
                    handleInputChange("scheduled_time", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleInputChange("duration", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="45min">45 minutes</SelectItem>
                  <SelectItem value="60min">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {questions.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Generated Questions
                </Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border rounded-lg p-3"
                    >
                      <p className="text-sm text-gray-700">
                        {index + 1}. {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={scheduleInterview}
              disabled={isScheduling || questions.length === 0}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isScheduling ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInterview;
