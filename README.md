# TaskFlow - Task Manager Web Application

TaskFlow is a modern, responsive web application that helps users organize their tasks, boost productivity, and track their progress in a simple and effective way. Create to-dos, categorize them, set deadlines, and never lose track of what matters.

## Features

- User authentication (Sign up / Log in / Log out)
- Responsive, clean dashboard for task overview
- Create, edit, and delete tasks with ease
- Add due dates, priorities, and tags to tasks
- Real-time feedback (e.g., notifications on actions)
- Search and filter tasks by keyword, tag, or status
- Light and dark mode toggle (optional)

## User Stories

1. **As a user**, I want to **create an account and log in**, so that I can access personalized features and save my progress.

2. **As a user**, I want to **view and interact with a clean, responsive dashboard**, so that I can easily access key features from any device.

3. **As a user**, I want to **create, edit, and delete entries/items/posts**, so that I can manage my content within the app.

4. **As a user**, I want to **receive notifications or feedback** after key actions (like saving or submitting forms), so that I know my action was successful.

5. **As a user**, I want to **search and filter through data/content**, so that I can quickly find what I’m looking for without scrolling through everything.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Auth**: JWT & bcrypt
- **Deployment**: Vercel / Netlify (frontend), Render / Railway (backend)

## Project Structure

/client # React frontend
/server # Express backend
.env # Environment variables
README.md

## Setup Instructions

1. Clone the repository
2. Set up `.env` files in both `/client` and `/server`
3. Run the backend server:
   ```bash
   cd server
   npm install
   npm run dev
4. Run the frontend:
   ```bash
   cd client
   npm install
   npm run dev
