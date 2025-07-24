// types.ts

export interface Interview {
  id: number;
  candidateName: string;
  candidateEmail: string;
  position: string;
  scheduledDate: string; // format: YYYY-MM-DD
  scheduledTime: string; // format: HH:mm
  duration: string; // e.g., "45min"
  status: "scheduled" | "completed" | "in-progress";
  roomLink: string;
  roomPassword: string;
  skills: string[];
  experience: string; // e.g., "3-5 years"
  resumeFile: string;
  questions: string[];
}

export interface InterviewStats {
  totalInterviews: number;
  scheduledInterviews: number;
  completedInterviews: number;
  activeInterviews: number;
  averageRating: number;
  thisWeekInterviews: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  company: string;
}

export interface JobDescription {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  department: string;
}
