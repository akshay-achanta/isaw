from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.models import Habit, LearningLog, Task, User
from .dependencies import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/")
def get_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simple rule-based logic
    insights = []
    
    # Habit Consistency
    habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    if not habits:
        insights.append("You haven't added any habits yet. Start small to build consistency!")
    else:
        low_streak = [h.title for h in habits if h.streak < 3]
        if low_streak:
            insights.append(f"Focus on {', '.join(low_streak[:2])} to build a 3-day streak!")
        else:
            insights.append("Great job! You are maintaining streaks on all your habits.")

    # Learning Trends
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_learning = db.query(LearningLog).filter(
        LearningLog.user_id == current_user.id,
        LearningLog.created_at >= week_ago
    ).all()
    total_mins = sum(log.duration for log in recent_learning)
    
    if total_mins < 60:
        insights.append("Your learning time is a bit low this week. Try to dedicate 15 mins a day.")
    elif total_mins > 300:
        insights.append("You are a learning machine! Keep up this incredible pace.")
    
    # Task Completion
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    completed = [t for t in tasks if t.is_completed]
    if tasks:
        completion_rate = len(completed) / len(tasks)
        if completion_rate < 0.5:
            insights.append("Your task completion rate is high. Try breaking down larget tasks into smaller ones.")
        else:
            insights.append("You're staying on top of your tasks. Keep it up!")

    return {
        "daily_suggestions": insights[:2],
        "weekly_report": {
            "total_learning_minutes": total_mins,
            "habit_summaries": [{"title": h.title, "streak": h.streak} for h in habits],
            "task_completion_rate": len(completed) / len(tasks) if tasks else 0
        }
    }
