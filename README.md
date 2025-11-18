#

A comprehensive AI-powered interview preparation and hiring platform that connects candidates with interviewers through real-time collaboration, interactive assessments, and intelligent job matching.

! Platform](https://github.com/vishaldangwal/interviewly/blob/main/public/ss03.png)
! Banner](https://github.com/vishaldangwal/interviewly/blob/main/public/ss01.png)

## 🚀 Features

### For Candidates

- **AI-Powered Interview Preparation**: Generate personalized study plans based on your skills, target position, and timeline
- **Interactive Quiz Platform**: Test your knowledge with auto-generated quizzes tailored to your learning needs
- **Flashcard System**: Create and manage custom flashcards with AI-generated answers and examples
- **Resume Builder**: Create professional resumes with AI assistance and multiple templates
- **Job Board**: Browse and apply to relevant job postings with integrated application tracking
- **Interview Scheduling**: Schedule and manage mock interviews with real interviewers
- **Real-time Video Interviews**: Conduct interviews with integrated code editor and collaborative tools
- **Performance Analytics**: Track your progress with detailed performance metrics and insights
- **Application Tracking**: Monitor your job applications with real-time status updates

### For Interviewers/Employers

- **Candidate Dashboard**: Review and manage candidate applications with comprehensive profiles
- **Job Posting Management**: Create, edit, and manage job postings with detailed requirements
- **Interview Creation**: Schedule interviews with candidates and assign coding problems
- **Problem Management**: Create and manage custom coding problems for technical assessments
- **Real-time Interview Tools**: Conduct interviews with live code editor, notes, and recording capabilities
- **Application Review System**: Review applications, update status, and provide feedback
- **Email Notifications**: Automated email notifications for application updates and interview scheduling
- **Activity Tracking**: Monitor all platform activities with detailed notifications

### Core Platform Features

- **Real-time Collaboration**: Live code editing, shared notes, and synchronized interview sessions
- **AI Integration**: Google Gemini API for intelligent question generation, study planning, and feedback
- **Video Conferencing**: High-quality video calls with screen sharing and recording capabilities
- **Role-based Access Control**: Separate interfaces for candidates and interviewers
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Email Notifications**: Automated email system for scheduling and status updates
- **Activity Feed**: Real-time notifications and activity tracking for all users

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: Custom React components with Tailwind CSS
- **State Management**: Convex queries and mutations
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Database**: Convex (real-time database with live queries)
- **Authentication**: Clerk with JWT integration
- **API**: Serverless functions and webhooks
- **Email Service**: React Email + Resend
- **AI Integration**: Google Gemini API
- **Video**: Stream API for video conferencing

### DevOps
- **Hosting**: Vercel
- **Monitoring**: Vercel Analytics
- **Version Control**: Git

## 🏗️ Architecture

The application follows a modern architecture leveraging Next.js 14 app router:

- **Server Components**: Optimized data fetching with React Server Components
- **Real-time Data**: Synchronized state across clients using Convex
- **Authentication**: Secure multi-provider auth through Clerk
- **API Layer**: RESTful endpoints with serverless functions
- **Webhook Integration**: Event-driven architecture for automated actions

## 📁 Project Structure

```/
├── convex/                    # Convex database schema and functions
│   ├── schema.ts             # Database schema definitions
│   ├── auth.config.ts        # Authentication configuration
│   ├── users.ts              # User management functions
│   ├── interviews.ts         # Interview management
│   ├── jobs.ts               # Job posting and applications
│   ├── questions.ts          # Coding problems management
│   ├── quizzes.ts            # Quiz system
│   ├── flashcards.ts         # Flashcard system
│   ├── activities.ts         # Activity tracking and notifications
│   └── comments.ts           # Interview feedback system
├── emails/                   # Email templates using React Email
│   ├── interview-scheduling.tsx
│   └── job-application-notification.tsx
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── (admin)/          # Admin/Interviewer routes
│   │   │   ├── dashboard/    # Interviewer dashboard
│   │   │   ├── post-job/     # Job posting interface
│   │   │   ├── manage-jobs/  # Job management
│   │   │   ├── create-problem/ # Problem creation
│   │   │   ├── all-problems/ # Problem management
│   │   │   ├── schedule/     # Interview scheduling
│   │   │   └── admin_activities/ # Admin activity feed
│   │   ├── (root)/           # Main application routes
│   │   │   ├── home/         # User dashboard
│   │   │   ├── prepare-interview/ # AI study planning
│   │   │   ├── quiz/         # Quiz system
│   │   │   ├── flashcard/    # Flashcard management
│   │   │   ├── make-resume/  # Resume builder
│   │   │   ├── jobs/         # Job board
│   │   │   ├── my-applications/ # Application tracking
│   │   │   ├── meeting/      # Video interview rooms
│   │   │   ├── recordings/   # Interview recordings
│   │   │   └── activities/   # User activity feed
│   │   └── api/              # API routes
│   ├── components/           # Global components
│   │   ├── ui/               # Core UI components
│   │   ├── landing/          # Landing page components
│   │   └── providers/        # Context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── constants/            # Application constants
└── public/                   # Static assets
```

## 🔒 Authentication & Authorization

The application uses Clerk for authentication with role-based access control:

- **Multi-provider Auth**: Email, social login, and SIWE (Sign in with Ethereum)
- **Role Management**: Separate interfaces for candidates and interviewers
- **JWT Integration**: Secure token-based authentication with Convex
- **Access Control**: UI and database-level permission enforcement

## 🔄 Real-time Features

Powered by Convex's real-time database:

- **Live Interview Sessions**: Real-time video calls with code editor and notes
- **Collaborative Coding**: Multiple users can edit code simultaneously
- **Instant Notifications**: Real-time activity updates and status changes
- **Live Application Tracking**: Real-time job application status updates
- **Synchronized Data**: Automatic content updates across all connected devices

## 🧠 AI Integration

The platform leverages Google Gemini API for:

- **Study Plan Generation**: Personalized learning paths based on skills gap analysis
- **Question Generation**: AI-powered quiz and flashcard content creation
- **Resume Enhancement**: Intelligent resume optimization suggestions
- **Interview Feedback**: Automated performance analysis and recommendations
- **Smart Matching**: AI-driven job-candidate matching

## 🎯 Key Workflows

### Candidate Journey
1. **Sign Up & Profile Creation**: Set up account with skills and experience
2. **AI Study Planning**: Generate personalized preparation roadmap
3. **Practice & Learn**: Use quizzes, flashcards, and coding problems
4. **Apply for Jobs**: Browse job board and submit applications
5. **Interview Preparation**: Schedule mock interviews and practice
6. **Track Progress**: Monitor applications and performance analytics

### Interviewer Journey
1. **Account Setup**: Create interviewer profile and preferences
2. **Job Posting**: Create detailed job listings with requirements
3. **Candidate Review**: Review applications and shortlist candidates
4. **Interview Scheduling**: Set up technical and behavioral interviews
5. **Conduct Interviews**: Use integrated tools for comprehensive assessment
6. **Provide Feedback**: Rate candidates and update application status

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Clerk account for authentication
- Convex account for database
- Resend account for email services
- Google Gemini API key for AI features
- Stream API key for video conferencing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishaldangwal/skillmint.git
   cd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your API credentials:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Convex Database
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   
   # Stream Video
   NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   
   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   
   # Resend Email
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Initialize Convex**
   ```bash
   npx convex dev
   ```

## 📊 Features in Detail

### AI-Powered Study Planning
- Personalized learning paths based on current skills vs. job requirements
- Time-based study schedules with daily breakdowns
- Skill gap analysis and targeted improvement recommendations
- Adaptive learning based on quiz performance

### Interactive Quiz System
- Auto-generated quizzes from AI based on topics and difficulty
- Multiple question types with detailed explanations
- Performance tracking with analytics and progress visualization
- Quiz history with retake capabilities and improvement tracking

### Flashcard Management
- Create custom flashcards with AI-generated answers
- Categorize flashcards by topics and subjects
- AI-powered answer generation with examples and explanations
- Spaced repetition learning system

### Resume Builder
- Professional templates with AI enhancement suggestions
- Real-time preview and editing capabilities
- Export to PDF with high-quality formatting
- AI-powered content optimization

### Job Board & Applications
- Comprehensive job listings with detailed requirements
- Application tracking with real-time status updates
- Cover letter management and resume upload
- Email notifications for application status changes

### Real-time Interview Platform
- High-quality video conferencing with screen sharing
- Integrated code editor with syntax highlighting
- Collaborative notes and feedback system
- Interview recording and playback capabilities
- Problem assignment and real-time evaluation

### Admin Dashboard
- Comprehensive candidate management interface
- Job posting creation and management tools
- Interview scheduling and problem assignment
- Application review and status management
- Activity tracking and notification system

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all tools
- **Tablet**: Optimized layout for touch interactions
- **Mobile**: Streamlined interface for on-the-go access

## 🔐 Security Features

- **End-to-end encryption** for sensitive user data
- **JWT-based authentication** with secure token management
- **Role-based access control** at UI and database levels
- **GDPR compliance** for data handling and privacy
- **Secure API endpoints** with proper validation

## 📧 Email System

Automated email notifications for:
- Interview scheduling confirmations
- Job application status updates
- New application notifications for employers
- Study plan reminders and progress updates

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with dark/light themes
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Intuitive Navigation**: Role-based navigation with clear user flows
- **Accessibility**: WCAG compliant design with keyboard navigation
- **Loading States**: Comprehensive loading indicators and skeleton screens

## 📝 License

[MIT](LICENSE)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please reach out to our team at vishaldangwal09@gmail.com or open an issue on GitHub.

---

*** - Empowering candidates and interviewers with AI-driven interview preparation and hiring solutions.