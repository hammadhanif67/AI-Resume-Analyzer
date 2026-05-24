from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError

from app.api import admin_routes, analysis_routes, auth_routes, contact_routes, report_routes, resume_routes, user_routes
from app.config import settings
from app.database.connection import create_tables
from app.utils.response_handler import error_response, success_response

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_tables()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=error_response(str(exc.detail)))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    errors = [{"field": ".".join(str(part) for part in error["loc"]), "message": error["msg"]} for error in exc.errors()]
    return JSONResponse(status_code=422, content=error_response("Validation failed", errors))


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(_: Request, exc: SQLAlchemyError) -> JSONResponse:
    return JSONResponse(status_code=500, content=error_response("Database operation failed"))


@app.exception_handler(Exception)
async def general_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content=error_response("Internal server error"))


@app.get("/health")
def health_check():
    return success_response("Backend is healthy", {"status": "ok"})


app.include_router(auth_routes.router, prefix=settings.api_prefix)
app.include_router(user_routes.router, prefix=settings.api_prefix)
app.include_router(contact_routes.router, prefix=settings.api_prefix)
app.include_router(admin_routes.router, prefix=settings.api_prefix)
app.include_router(resume_routes.router, prefix=settings.api_prefix)
app.include_router(analysis_routes.router, prefix=settings.api_prefix)
app.include_router(report_routes.router, prefix=settings.api_prefix)
settings.upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
