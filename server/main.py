from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# import Services
from services import cleanup_expired_candidates

# import Routes
from routes import auth, candidates, features, payments, communications

# App Initialization
app = FastAPI(title="VeeBot API - AI Recruiter")

# Cors Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Cleanup Scheduler Configuration
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    # Schedule daily cleanup job
    scheduler.add_job(cleanup_expired_candidates, "interval", hours=24)
    scheduler.start()
    print("⏰ Scheduler de limpieza automática activado (Ciclo: 24h)")
    # Initial cleanup on startup(optional)
    cleanup_expired_candidates() 

@app.on_event("shutdown")
async def stop_scheduler():
    scheduler.shutdown()


# Route Inclusions
# 1. Users & Auth (Register, Login, Profile)
app.include_router(auth.router, tags=["Auth"])
# 2. Candidates (Upload, List, Detail, Delete)
app.include_router(candidates.router, tags=["Candidates"])

# 3. Features Avanzadas (CSV, Seed, Compare, Simulate)
app.include_router(features.router, tags=["Features"])

# 4. Pagos (Lemon Squeezy)
app.include_router(payments.router, tags=["Payments"])

# 5. Comunicaciones (Email, Contacto)
app.include_router(communications.router, tags=["Communications"])

# --- ENDPOINT RAÍZ (Health Check) ---
@app.get("/")
def read_root():
    return {"status": "online", "message": "VeeBot API is running 🚀"}