# AI Timetable Generation System

A comprehensive, intelligent timetable generation system designed for educational institutions, featuring advanced AI algorithms, constraint satisfaction, and modern web interface.

## 🚀 Features

### Core Functionality
- **AI-Powered Scheduling**: Advanced algorithms including Greedy, Backtracking, and Constraint Satisfaction Problem (CSP) solvers
- **Multi-Algorithm Support**: Choose from different optimization strategies based on your institution's needs
- **Conflict Resolution**: Automatic detection and resolution of scheduling conflicts
- **Resource Optimization**: Efficient allocation of rooms, faculty, and time slots

### User Interfaces
- **Admin Dashboard**: Comprehensive management interface with analytics and insights
- **Faculty Portal**: Availability management and schedule viewing for teaching staff
- **Student Portal**: Course enrollment and personal schedule access
- **Analytics Dashboard**: Detailed reports on utilization, workload distribution, and system metrics

### Technical Features
- **Real-time Generation**: Live progress tracking during timetable creation
- **Database Integration**: Robust data management with Supabase
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **Authentication**: Secure user management and role-based access control

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL)
- **Algorithms**: Python-based optimization engines
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Python 3.8+ (for algorithm execution)

## 🚀 Quick Start

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd ai-timetable-system
npm install
\`\`\`

### 2. Environment Setup
Configure your environment variables in Vercel or create a `.env.local` file:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 3. Database Setup
Run the SQL scripts to set up your database schema:
1. Execute `scripts/001_create_timetable_schema.sql` in your Supabase SQL editor
2. Execute `scripts/002_seed_sample_data.sql` for sample data

### 4. Run the Application
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the application.

## 📖 Usage Guide

### For Administrators
1. **Institution Setup**: Configure your institution, departments, and basic settings
2. **Resource Management**: Add rooms, time slots, and course information
3. **Faculty Management**: Register faculty members and their specializations
4. **Student Management**: Enroll students and manage course assignments
5. **Timetable Generation**: Use the AI engine to generate optimized schedules

### For Faculty
1. **Availability Setting**: Mark your preferred and unavailable time slots
2. **Schedule Viewing**: Access your teaching schedule and room assignments
3. **Course Management**: View assigned courses and student enrollments

### For Students
1. **Course Enrollment**: Browse and enroll in available courses
2. **Schedule Access**: View your personal class timetable
3. **Academic Planning**: Track your course progress and requirements

## 🔧 Configuration

### Algorithm Selection
Choose from three optimization algorithms:
- **Greedy Algorithm**: Fast generation with good results for simple constraints
- **Backtracking**: Thorough search ensuring all constraints are satisfied
- **CSP Solver**: Advanced constraint satisfaction with optimization heuristics

### Constraint Types
- Faculty availability and preferences
- Room capacity and equipment requirements
- Course prerequisites and dependencies
- Student enrollment limits
- Time slot restrictions
- Department-specific requirements

## 📊 Analytics & Reporting

The system provides comprehensive analytics including:
- Room utilization rates and patterns
- Faculty workload distribution
- Course enrollment statistics
- Schedule conflict reports
- System performance metrics
- Trend analysis and insights

## 🔒 Security

- Role-based access control (Admin, Faculty, Student)
- Secure authentication with Supabase Auth
- Row-level security (RLS) for data protection
- Input validation and sanitization
- Secure API endpoints

## 🚀 Deployment

### Vercel Deployment 
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🔄 Updates & Roadmap

### Current Version: 1.0.0
- Complete timetable generation system
- Multi-algorithm support
- Comprehensive user interfaces
- Analytics and reporting

### Planned Features
- Mobile application
- Advanced AI/ML optimization
- Integration with external systems
- Multi-language support
- Advanced reporting tools



