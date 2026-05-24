from sqlalchemy.orm import Session

from app.models.job_description_model import ActivityLog
from app.models.user_model import User


def log_activity(db: Session, user: User, action: str, status: str, message: str) -> ActivityLog:
    log = ActivityLog(user_id=user.id, action=action, status=status, message=message[:255])
    db.add(log)
    db.commit()
    return log
