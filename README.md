# Task Management API

A RESTful API for managing tasks, built with Node.js, Express, and Supabase.

## Project Overview

The Task Management API provides a robust backend for task management applications, allowing users to create, manage, and track tasks across different categories. The system includes user authentication, task categorization, status tracking, and analytical capabilities.

## Features

- **User Authentication**: Secure signup and login using Supabase Auth
- **Task Categories**: Create and manage categories to organize tasks
- **Task Management**: Complete CRUD operations for tasks with status tracking
- **Status Logging**: Automatic logging of task status changes
- **Analytics**: Task completion rates and overdue task reporting
- **Daily Digest**: Scheduled job that generates daily summaries of tasks

## Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT
- **Validation**: Joi schema validation
- **Documentation**: OpenAPI/Swagger
- **Task Scheduling**: node-cron
- **Development Tools**: ESLint, Prettier

## Setup Instructions

### Prerequisites

- Node.js (v22 or higher)
- npm
- Supabase account and project

### Database Setup

1. Create a new Supabase project
2. Set up the following tables in the Supabase database:

   **categories**

   ```sql
   CREATE TABLE categories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **tasks**

   ```sql
   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     description TEXT,
     category_id UUID REFERENCES categories(id),
     user_id UUID REFERENCES auth.users(id),
     status TEXT DEFAULT 'pending',
     due_date DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **task_status_logs**

   ```sql
   CREATE TABLE task_status_logs (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
     status TEXT NOT NULL,
     changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     changed_by UUID REFERENCES auth.users(id)
   );
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
FA_PORT=3000
FA_SUPABASE_URL=supabase_url
FA_SUPABASE_DATABASE_PASSWORD=database_password
FA_SUPABASE_PUBLIC_API_KEY=public_api_key
FA_SUPABASE_SERVICE_KEY=service_key
FA_SUPABASE_JWT_SECRET=jwt_secret
```

These values can be found in the Supabase project dashboard.

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/umairjibran/task-management-api.git
   cd task-management-api
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. For production, use
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000` (or the port specified in the environment variables).

## API Documentation

Comprehensive API documentation is available at `/api-docs` when the server is running. Here's a summary of the available endpoints:

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate a user and receive JWT token

### Categories

- `POST /api/categories`: Create a new category
- `GET /api/categories`: List all categories
- `GET /api/categories/:id`: Get a specific category
- `PUT /api/categories/:id`: Update a category
- `DELETE /api/categories/:id`: Delete a category

### Tasks

- `POST /api/tasks`: Create a new task
- `GET /api/tasks`: List all tasks (with optional filters)
- `GET /api/tasks/:id`: Get a specific task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

### Analytics

- `GET /api/analytics/completion-rate`: Get task completion rates
- `GET /api/analytics/overdue-tasks`: Get list of overdue tasks

For detailed request/response examples, refer to the Swagger documentation or see the `api-examples.sh` script.

## Implementation Decisions

### Architecture

The project follows a standard Express.js application structure:

- **Controller-Route-Validation pattern**: Separates concerns and maintains clean code organization
- **Middleware approach**: Provides reusable functionality for authentication and validation

### Authentication Strategy

Supabase Auth is used for authentication, providing:

- Secure user registration and login
- JWT-based authentication
- Token validation and user identification

### Database Design

The database schema is designed with the following considerations:

- **Normalization**: Proper separation of entities (users, tasks, categories)
- **Audit Trail**: Status changes are tracked in a separate table
- **Relationship Integrity**: Foreign key constraints ensure data consistency
- **Leverage Supabase Auth**: User management is delegated to Supabase Auth

### Error Handling

The API implements consistent error handling with:

- Appropriate HTTP status codes
- Descriptive error messages
- Joi validation for request data
- Try-catch blocks for handling unexpected errors

### Scheduled Jobs

A daily digest is implemented using node-cron:

- Runs at midnight every day
- Summarizes upcoming, overdue, and recently completed tasks
- In development mode, runs immediately at startup for testing

## Future Enhancements

- Add pagination for list endpoints
- Implement filtering and sorting options
- Add email notifications for the daily digest
- Add user preferences and task priorities
- Implement tagging system for tasks
