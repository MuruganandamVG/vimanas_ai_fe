export const mockInterviews = [
  {
    id: 1,
    candidateName: "John Doe",
    candidateEmail: "john.doe@email.com",
    position: "Frontend Developer",
    scheduledDate: "2025-01-15",
    scheduledTime: "14:00",
    duration: "45min",
    status: "scheduled",
    roomLink: "https://interview.platform.com/room/abc123",
    roomPassword: "INT2025",
    skills: ["React", "JavaScript", "CSS"],
    experience: "3-5 years",
    resumeFile: "john_doe_resume.pdf",
    questions: [
      "Tell me about your experience with React hooks",
      "How do you handle state management in large applications?",
      "Explain the difference between controlled and uncontrolled components",
      "What are your strategies for optimizing React performance?",
      "How do you approach responsive design?",
    ],
  },
  {
    id: 2,
    candidateName: "Jane Smith",
    candidateEmail: "jane.smith@email.com",
    position: "Backend Developer",
    scheduledDate: "2025-01-16",
    scheduledTime: "10:30",
    duration: "60min",
    status: "completed",
    roomLink: "https://interview.platform.com/room/def456",
    roomPassword: "INT2026",
    skills: ["Python", "Django", "PostgreSQL"],
    experience: "2-3 years",
    resumeFile: "jane_smith_resume.pdf",
    questions: [
      "Explain your experience with Django ORM",
      "How do you handle database migrations?",
      "What is your approach to API design?",
      "How do you ensure code quality and testing?",
      "Tell me about a challenging bug you solved",
    ],
  },
  {
    id: 3,
    candidateName: "Mike Johnson",
    candidateEmail: "mike.johnson@email.com",
    position: "Full Stack Developer",
    scheduledDate: "2025-01-17",
    scheduledTime: "15:30",
    duration: "30min",
    status: "in-progress",
    roomLink: "https://interview.platform.com/room/ghi789",
    roomPassword: "INT2027",
    skills: ["Node.js", "React", "MongoDB"],
    experience: "1-2 years",
    resumeFile: "mike_johnson_resume.pdf",
    questions: [
      "How do you structure a full-stack application?",
      "What's your experience with RESTful APIs?",
      "How do you handle authentication and authorization?",
      "Tell me about your database design approach",
      "What tools do you use for testing?",
    ],
  },
];

export const mockStats = {
  totalInterviews: 156,
  scheduledInterviews: 12,
  completedInterviews: 144,
  activeInterviews: 1,
  averageRating: 4.2,
  thisWeekInterviews: 8,
};

export const mockUser = {
  id: 1,
  name: "Sarah Wilson",
  email: "sarah.wilson@company.com",
  role: "HR Manager",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616b25e6f87?w=150&h=150&fit=crop&crop=face",
  company: "Tech Solutions Inc.",
};

export const mockJobDescriptions = [
  {
    id: 1,
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, JavaScript, and modern web technologies.",
    requirements: [
      "3+ years React experience",
      "Strong JavaScript skills",
      "Experience with responsive design",
      "Knowledge of testing frameworks",
    ],
    department: "Engineering",
  },
  {
    id: 2,
    title: "Backend Developer",
    description:
      "Seeking a Backend Developer with expertise in Python and Django. You will be responsible for building scalable web applications and APIs.",
    requirements: [
      "2+ years Python experience",
      "Django framework knowledge",
      "Database design skills",
      "API development experience",
    ],
    department: "Engineering",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    description:
      "Looking for a versatile Full Stack Developer who can work on both frontend and backend technologies.",
    requirements: [
      "Experience with React and Node.js",
      "Database knowledge",
      "RESTful API design",
      "Version control (Git)",
    ],
    department: "Engineering",
  },
];

// Mock functions for data manipulation
export const getMockInterviews = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockInterviews), 500);
  });
};

export const createMockInterview = (interviewData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInterview = {
        id: mockInterviews.length + 1,
        ...interviewData,
        status: "scheduled",
        roomLink: `https://interview.platform.com/room/${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        roomPassword: `INT${Math.floor(Math.random() * 10000)}`,
        questions: [], // Will be populated by AI
      };
      mockInterviews.push(newInterview);
      resolve(newInterview);
    }, 1000);
  });
};

export const generateMockQuestions = (skills, experience, jobDescription) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const questions = [
        `Tell me about your experience with ${skills[0]}`,
        `How would you approach ${jobDescription.slice(0, 50)}...?`,
        `With ${experience} experience, what challenges have you faced?`,
        `How do you stay updated with new technologies?`,
        `Describe a project you're proud of`,
      ];
      resolve(questions);
    }, 2000);
  });
};
