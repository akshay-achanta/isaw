# Personal AI Productivity Tracker

A production-ready productivity tracking application with AI-based insights.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Recharts, Lucide Icons, Axios.
- **Backend**: FastAPI (Python), PostgreSQL, SQLAlchemy.
- **Auth**: JWT-based authentication.

## Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file with your PostgreSQL credentials.
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- **Dashboard**: High-level overview of your productivity metrics and AI insights.
- **Habit Tracker**: Daily habit completion with streak tracking.
- **Daily Planner**: Time-blocked schedule management.
- **Learning Log**: Track minutes spent learning and topic categories.
- **Task System**: Simple and effective todo list with priority levels.
- **AI Insights**: Rule-based feedback on your productivity patterns.

## Database Schema
- `users`: User profiles and authentication.
- `habits`: Habit definitions.
- `habit_logs`: Daily tracking logs for habits.
- `schedules`: Time-blocked activities.
- `learning_logs`: Educational session logs.
- `tasks`: Individual todo items.

## Future Improvements
- [ ] Integration with External AI APIs (OpenAI/Gemini) for deeper insights.
- [ ] Push notifications using Web Push API.
- [ ] Drag-and-drop support for the schedule planner.
- [ ] Export data to CSV/PDF.
- [ ] Dark mode support.
