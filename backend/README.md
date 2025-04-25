# Labour Attendance Management System - Backend

This is the backend for the Labour Attendance Management System, built with Node.js, Express, MongoDB, and TypeScript.

## Features

- User authentication and authorization (Admin and Team Lead roles)
- Labour management
- Farmer management
- Project management
- Attendance tracking
- Automatic wage calculation
- Reporting and analytics
- Feedback system
- Telugu language support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image storage)

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Create a `.env` file in the root directory with the following variables:
   \`\`\`
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   \`\`\`
4. Build the TypeScript code:
   \`\`\`
   npm run build
   \`\`\`
5. Start the server:
   \`\`\`
   npm start
   \`\`\`
   
   For development:
   \`\`\`
   npm run dev
   \`\`\`

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/logout` - Logout user

### User Routes (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/approve` - Approve team lead

### Labour Routes

- `GET /api/labours` - Get all labours
- `GET /api/labours/:id` - Get single labour
- `POST /api/labours` - Create labour (Team Lead, Admin)
- `PUT /api/labours/:id` - Update labour (Team Lead, Admin)
- `DELETE /api/labours/:id` - Delete labour (Team Lead, Admin)

### Farmer Routes

- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get single farmer
- `POST /api/farmers` - Create farmer
- `PUT /api/farmers/:id` - Update farmer
- `DELETE /api/farmers/:id` - Delete farmer (Admin only)
- `PUT /api/farmers/:id/assign-team-lead/:teamLeadId` - Assign team lead to farmer (Admin only)
- `PUT /api/farmers/:id/remove-team-lead/:teamLeadId` - Remove team lead from farmer (Admin only)

### Project Routes

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Attendance Routes

- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get single attendance record
- `POST /api/attendance` - Create attendance record (Team Lead, Admin)
- `PUT /api/attendance/:id` - Update attendance record (Team Lead, Admin)
- `DELETE /api/attendance/:id` - Delete attendance record (Team Lead, Admin)
- `GET /api/attendance/summary/labour/:labourId` - Get attendance summary by labour
- `GET /api/attendance/summary/farmer/:farmerId` - Get attendance summary by farmer
- `GET /api/attendance/summary/project/:projectId` - Get attendance summary by project

### Feedback Routes

- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/:id` - Get single feedback
- `POST /api/feedback` - Create feedback (Public)
- `PUT /api/feedback/:id` - Update feedback (mark as resolved)
- `DELETE /api/feedback/:id` - Delete feedback (Admin only)
