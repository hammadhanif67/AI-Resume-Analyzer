from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Resume Analyzer"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./resume_analyzer.db"
    jwt_secret_key: str = "change-this-secret-key-for-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    max_upload_size_mb: int = 5
    upload_dir: Path = Path("uploads")
    allowed_file_types: set[str] = {".pdf", ".docx"}
    debug_password_reset_tokens: bool = False
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
