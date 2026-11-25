import hashlib
import hmac
import os
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Resume Analyzer"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./resume_analyzer.db"
    jwt_secret_key: str = "change-this-secret-key-for-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    max_upload_size_mb: int = 5
    # Vercel functions can only write to /tmp.
    upload_dir: Path = Path("/tmp/uploads") if os.environ.get("VERCEL") else Path("uploads")
    allowed_file_types: set[str] = {".pdf", ".docx"}
    debug_password_reset_tokens: bool = False
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    cors_origin_regex: str | None = r"^https://.*\.vercel\.app$" if os.environ.get("VERCEL") else None

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: object) -> object:
        # Pin the psycopg2 driver (what requirements.txt installs); newer
        # SQLAlchemy releases default bare "postgresql://" URLs to psycopg 3.
        if isinstance(value, str):
            for prefix in ("postgres://", "postgresql://"):
                if value.startswith(prefix):
                    return "postgresql+psycopg2://" + value[len(prefix):]
        return value

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip().startswith("["):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def model_post_init(self, __context: object) -> None:
        # Hosted deployments without an explicit JWT_SECRET_KEY derive a stable,
        # private signing key from the database URL (which carries the DB password),
        # so no secret has to be pasted into a dashboard.
        if self.jwt_secret_key == "change-this-secret-key-for-production" and not self.database_url.startswith("sqlite"):
            self.jwt_secret_key = hmac.new(self.database_url.encode(), b"ai-resume-analyzer/jwt", hashlib.sha256).hexdigest()


settings = Settings()
