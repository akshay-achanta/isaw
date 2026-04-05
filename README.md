# Personal AI Productivity Tracker

A production-ready productivity tracking application with AI-based insights.

## 🚀 Live Deployment
- **Frontend (UI)**: [https://poetic-reflection-production.up.railway.app](https://poetic-reflection-production.up.railway.app)
- **Backend (API)**: [https://isaw-production.up.railway.app](https://isaw-production.up.railway.app)
- **API Documentation**: [https://isaw-production.up.railway.app/docs](https://isaw-production.up.railway.app/docs)

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

- **AI Insights**: Rule-based feedback on your productivity patterns.

## 🗺️ Frontend Map & Routes
- `/dashboard`: Main entry point with total stats, AI suggestions, and trending charts.
- `/habits`: Manager for your daily routines.
- `/habits/check`: Simplified "Yes/No" completion screen for the day.
- `/schedule`: Time-blocked daily planner for deep work and chores.
- `/tasks`: Simple todo list management.
- `/learning`: Educational log to track your time investment in new skills.
- `/notes`: Minimalist catch-all thinking space with theme support.
- `/summary`: Holistic report page with Excel data export capabilities.
- `/login` / `/register`: Secure authentication portals.

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
