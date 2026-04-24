from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# import Services
from services import cleanup_expired_candidates

# import Routes
from routes import auth, candidates, features, payments, communications

# ── App Initialization ──────────────────────────────────────────────────────
# max_request_body_size: 500 MB — soporta hasta ~100 PDFs por carga
_500_MB = 500 * 1024 * 1024

app = FastAPI(
    title="VeeBot API - AI Recruiter",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Multipart upload size (Starlette level) ──────────────────────────────────
# Starlette expone FORM_MAX_SIZE a través de FormData.
# El límite real lo controlamos desde uvicorn con --limit-max-requests
# y desde el servidor con el header Content-Length. El semaphore en el
# endpoint ya controla la concurrencia en el procesamiento.

# ── Cleanup Scheduler ────────────────────────────────────────────────────────
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    scheduler.add_job(cleanup_expired_candidates, "interval", hours=24)
    scheduler.start()
    print("⏰ Scheduler de limpieza automática activado (Ciclo: 24h)")
    cleanup_expired_candidates()

@app.on_event("shutdown")
async def stop_scheduler():
    scheduler.shutdown()

# ── Route Inclusions ──────────────────────────────────────────────────────────
app.include_router(auth.router, tags=["Auth"])
app.include_router(candidates.router, tags=["Candidates"])
app.include_router(features.router, tags=["Features"])
app.include_router(payments.router, tags=["Payments"])
app.include_router(communications.router, tags=["Communications"])

# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"status": "online", "message": "VeeBot API is running 🚀"}