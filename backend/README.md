# AI Resume Analyzer

Local-first FYP project for AI-assisted resume analysis. The app includes a FastAPI backend, React/Vite frontend, JWT authentication, resume upload and parsing, rule-based ATS analysis, report storage, PDF report download, and an admin dashboard.

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite, Pydantic, JWT, bcrypt
- Resume parsing: pdfplumber, python-docx
- Reports: ReportLab
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, React Query, Zustand, Axios

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URLs:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
```

## Frontend Setup

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Run:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Environment Variables

Create a `.env` file in `backend/` when you want to override defaults:

```env
APP_NAME="AI Resume Analyzer"
API_PREFIX="/api"
DATABASE_URL="sqlite:///./resume_analyzer.db"
JWT_SECRET_KEY="change-this-secret-key"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MAX_UPLOAD_SIZE_MB=5
UPLOAD_DIR="uploads"
DEBUG_PASSWORD_RESET_TOKENS=false
```

Frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Demo Credentials

Use these accounts for local demos:

Admin:

```text
Email: admin556@gmail.com
Password: Admin556@556
```

Normal user:

```text
Email: haidarali878889@gmail.com
Password: Hadi@12345
```

If the local SQLite database was reset, recreate the admin account with:

```bash
cd backend
venv\Scripts\activate
python scripts/create_admin.py --name "Admin User" --email admin556@gmail.com --password "Admin556@556"
```

Create the normal user through the signup page to demonstrate the complete flow.

## Project Workflow

1. Start the backend and frontend.
2. Sign up as a normal user.
3. After signup, the app redirects to login instead of auto-login.
4. Login manually.
5. Upload a PDF or DOCX resume.
6. The backend extracts text, analyzes the resume, stores the report, and returns the analysis.
7. Open Reports to view previous reports.
8. Open a report detail page and download the PDF.
9. Login as admin.
10. Open Admin Dashboard to review users, resumes, reports, and activity logs.
11. Open Admin Reports and use View to inspect reports across users.

## API Summary

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/profile`
- `PUT /api/profile`
- `PATCH /api/profile`
- `POST /api/contact/messages`
- `GET /api/admin/overview`
- `GET /api/admin/users`
- `GET /api/admin/resumes`
- `GET /api/admin/reports`
- `GET /api/admin/reports/{report_id}`
- `GET /api/admin/logs`
- `GET /api/admin/contact-messages`
- `PATCH /api/admin/contact-messages/{message_id}/status`
- `POST /api/resume/upload`
- `POST /api/analysis/resume/{resume_id}`
- `POST /api/analysis/job-match`
- `GET /api/report/{report_id}`
- `GET /api/report/history`
- `GET /api/report/{report_id}/download`
- `GET /api/reports/{report_id}` legacy alias

## Response Format

Success:

```json
{
  "success": true,
  "message": "Meaningful message",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Meaningful error",
  "data": null
}
```

Validation errors return `data` as a list of field-level issues.

## Database Tables

- `users`
- `resumes`
- `analysis_reports`
- `skills_found`
- `missing_skills`
- `job_descriptions`
- `activity_logs`
- `password_reset_tokens`

Tables are created automatically on application startup. SQLite is used for local development.

## Admin Access

Users support two roles:

- `user`
- `admin`

Admin APIs require a valid JWT for a user with `role="admin"`. Normal users receive `403 Admin access required`.

Create or promote a local admin user with:

```bash
cd backend
venv\Scripts\activate
python scripts/create_admin.py
```

The script asks for name, email, and password interactively. It does not hardcode credentials. If the email already exists, re-run with `--promote-existing` to explicitly promote that account and update its password.

Admin APIs:

- `GET /api/admin/overview` - totals, latest uploads, latest reports, backend status
- `GET /api/admin/users` - users with resume/report counts
- `GET /api/admin/resumes` - uploaded resumes across users
- `GET /api/admin/reports` - generated reports across users
- `GET /api/admin/reports/{report_id}` - admin report detail across users
- `GET /api/admin/logs` - recent activity logs

## Activity Logs

The backend records activity for:

- user register
- user login success and failure
- logout
- forgot password request
- password reset
- resume upload
- resume analysis
- job match
- report download
- admin login
- admin dashboard access

## Resume Upload Rules

- Only `.pdf` and `.docx` files are accepted
- MIME type is checked
- Empty files are rejected
- Default max size is 5 MB
- Files are saved with generated unique filenames
- Files are stored under `uploads/{user_id}/`

## Password Reset

Password reset is local-first for FYP development.

- `POST /api/auth/forgot-password` always returns:
  `If this email exists, a password reset link has been sent.`
- If the email exists, the backend creates a secure random reset token.
- Only the token hash is stored in the database.
- Tokens expire after 30 minutes.
- Used tokens are invalidated after a successful reset.
- For local development only, set `DEBUG_PASSWORD_RESET_TOKENS=true` to print the reset token and reset link in the backend console/logs.
- SMTP/email sending can be added later through environment-based configuration; no email credentials are hardcoded.

## Analysis Features

- PDF and DOCX text extraction
- Text cleanup and normalization
- Enhanced section detection with missing section notes
- Expanded skill extraction with aliases and confidence scores
- ATS score breakdown with points, max points, reasons, and improvement tips
- Readability analysis for length, line length, bullet usage, repeated words, and weak wording
- Achievement quality checks for weak bullet phrases
- Job match output with matched/missing skills, keywords, phrases, and missing skill priority
- Report detail and history endpoints
- PDF report download using ReportLab

## AI Engine

The current AI engine is local-first and rule-based. It does not call external AI APIs.

Skill extraction uses a curated dictionary across:

- Frontend
- Backend
- Database
- DevOps
- AI/ML
- Cloud
- Tools
- Soft Skills

Aliases such as `JS`, `TS`, `React.js`, and `Postgres` are normalized to canonical skill names. Duplicate skills are removed before report storage.

## Scoring Formula

ATS score is calculated out of 100:

- Contact information: 10
- Section completeness: 15
- Skills score: 15
- Formatting score: 15
- Keyword score: 10
- Readability score: 10
- Experience/project quality: 15
- Job match: 20

Each category returns awarded marks, maximum marks, a reason, and an improvement tip.

## Tests

Backend tests:

```bash
cd backend
venv\Scripts\activate
pytest
```

Frontend build:

```bash
cd frontend
npm run build
```

The tests cover:

- register
- login
- upload invalid file
- upload valid DOCX resume
- upload valid PDF resume
- upload empty/corrupt/oversized files
- analyze resume
- skill extraction
- section detection
- readability analysis
- ATS scoring breakdown
- job match
- get report
- report history
- PDF report download
- admin route authorization
- admin overview/users/resumes/reports/logs APIs
- admin report detail API

## Demo Checklist

- Backend health returns success
- Signup redirects to login
- User login opens dashboard
- PDF/DOCX upload works
- Analysis creates a report
- Reports list opens detail by report id
- PDF download works
- Admin login opens `/admin`
- Admin users/resumes/reports/logs load
- Admin report detail opens `/admin/reports/{report_id}`
- Normal users cannot access admin routes
- `npm run build` passes
- `npm run preview` serves the production frontend build
- `/health` and `/docs` are available before frontend deployment testing

## Known Limitations

- Readability and achievement scoring are rule-based and should be validated against real resumes
- PDF extraction depends on text-based PDFs; scanned image PDFs need OCR in a later phase
- No Alembic migrations yet; local SQLite schema is auto-created
- Semantic matching is keyword/phrase based, not embedding based
- Local file uploads need persistent storage when deployed to a hosted environment

## Future Improvements

- OCR support for scanned PDFs
- Alembic migrations
- Embedding-based semantic job matching
- Grammar analysis with a dedicated NLP library
- Better achievement scoring using quantified outcome detection
- Better PDF report template
- CI test workflow
