# AI Resume Analyzer

Premium AI SaaS-style resume analysis project with a FastAPI backend and React/Vite frontend.

## What It Includes

- Public website: Home, Features, How It Works, About, Contact
- Auth: register, login, logout, password reset
- User app: dashboard, resume upload, analysis, reports, profile
- Admin app: overview, users, resumes, reports, logs, contact messages
- Resume analysis: PDF/DOCX parsing, ATS scoring, skill signals, job matching, PDF report download

## Quick Start

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Local URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend health: `http://127.0.0.1:8000/health`
- Backend docs: `http://127.0.0.1:8000/docs`

## Environment Variables

Frontend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Backend:

```env
APP_NAME="AI Resume Analyzer"
API_PREFIX="/api"
DATABASE_URL="sqlite:///./resume_analyzer.db"
JWT_SECRET_KEY="change-this-secret-key-for-production"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MAX_UPLOAD_SIZE_MB=5
UPLOAD_DIR="uploads"
DEBUG_PASSWORD_RESET_TOKENS=false
```

For production, set a strong `JWT_SECRET_KEY`, configure the deployed frontend origin in backend CORS settings, and keep `DEBUG_PASSWORD_RESET_TOKENS=false`.

## Production Checks

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

Backend:

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app
```

Verify:

- `GET /health`
- `GET /docs`
- Public pages load without auth
- Protected user/admin pages redirect correctly when logged out
- Upload, analysis, reports, profile, and admin tables work after login

## Deployment Notes

- Deploy `frontend/dist` from `npm run build`.
- Point `VITE_API_BASE_URL` to the deployed backend URL.
- The backend currently uses SQLite by default. For hosted production, prefer a managed database and migration workflow.
- Uploaded resumes and profile images are stored under `backend/uploads` by default. Use persistent storage in production.

## Known Limitations

- Scanned image PDFs require future OCR support.
- The analysis engine is local-first/rule-based, not an external LLM.
- SQLite and auto-created tables are suitable for local/FYP deployment; a migration-backed database is recommended for production hosting.
