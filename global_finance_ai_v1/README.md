# GLOBAL FINANCE AI — V1.0 Starter

A small, runnable foundation for the GLOBAL FINANCE AI internal market workspace.
This is a development scaffold, not a deployed or market-data-connected product.

## Stack
- Frontend: React + TypeScript + Vite
- Backend: Python + FastAPI
- API contract: `/api/health`, `/api/markets/overview`
- Market values intentionally return `pending` until a licensed data provider is configured.

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal. The frontend expects the API at `http://localhost:8000`.
Set `VITE_API_BASE_URL` to override it.

## Important
- No credentials or API keys are included.
- Do not put provider secrets in frontend code.
- Connect only licensed market-data/news providers.
- Keep timestamps, timezone, source, delay status, and currency with every quote.
- Never interpret ETF AUM change as net flows without separating price effects and share changes.
