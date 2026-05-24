from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings
from app.database.base import Base


engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _ensure_sqlite_columns()


def _ensure_sqlite_columns() -> None:
    if not settings.database_url.startswith("sqlite"):
        return
    with engine.connect() as connection:
        columns = connection.execute(text("PRAGMA table_info(analysis_reports)")).fetchall()
        column_names = {column[1] for column in columns}
        changed = False
        if columns and "score_breakdown" not in column_names:
            connection.execute(text("ALTER TABLE analysis_reports ADD COLUMN score_breakdown TEXT"))
            changed = True
        if columns and "enhanced_analysis" not in column_names:
            connection.execute(text("ALTER TABLE analysis_reports ADD COLUMN enhanced_analysis TEXT"))
            changed = True
        user_columns = connection.execute(text("PRAGMA table_info(users)")).fetchall()
        user_column_names = {column[1] for column in user_columns}
        if user_columns and "profile_image" not in user_column_names:
            connection.execute(text("ALTER TABLE users ADD COLUMN profile_image TEXT"))
            changed = True
        contact_columns = connection.execute(text("PRAGMA table_info(contact_messages)")).fetchall()
        contact_column_names = {column[1] for column in contact_columns}
        if contact_columns and "subject" not in contact_column_names:
            connection.execute(text("ALTER TABLE contact_messages ADD COLUMN subject TEXT NOT NULL DEFAULT 'General'"))
            changed = True
        if changed:
            connection.commit()
