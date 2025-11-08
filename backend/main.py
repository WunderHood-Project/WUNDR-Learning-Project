# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers.auth.routes import router as auth_router
# from routers.user import router as user_router
# from routers.child import router as child_router
# from routers.activities import router as activity_router
# from routers.events import router as event_router
# from routers.reviews import router as review_router
# from routers.password_reset import router as password_reset_router
# from routers.notifications import router as notifications_router
# from routers.emergency_contact import router as emergency_contact_router
# from routers.volunteer import router as volunteer_router
# # from backend.routers.volunteer_opportunity import router as volunteer_opportunity_router
# from routers.volunteer_opportunity import router as opportunities_router
# from routers.payments import router as donation_router
# from db.prisma_client import db
# from routers.notifications import start_scheduler, scheduler
# from contextlib import asynccontextmanager

# # When we start the app, connect to the db. When we shut down the app, disconnect
# # @app.on_event("startup")
# @asynccontextmanager
# async def lifespan(app:FastAPI):
#     await db.connect()

#     # Start APScheduler here:
#     start_scheduler()
#     yield

# # @asynccontextmanager
# # async def shutdown(app:FastAPI):
# #     # Shutdown APScheduler:

#     scheduler.shutdown(wait=False)
#     await db.disconnect()


# # instantiate FastAPI app and Prisma db client
# app = FastAPI(lifespan=lifespan)

# # CORS Policy
# app.add_middleware(
#     CORSMiddleware,

#     allow_origins=["http://localhost:3000", "https://wonderhood-frontend.onrender.com", "https://whproject.org", "https://www.whproject.org"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Health check (for Render)
# @app.get("/health")
# def health():
#     return {"ok": True}

# # Main routes
# @app.get('/')
# def read_root():
#     return {"Hello": "World"}


# # Routers
# app.include_router(auth_router, prefix="/auth")
# app.include_router(user_router, prefix="/user")
# app.include_router(child_router, prefix="/child")
# app.include_router(activity_router, prefix="/activity")
# app.include_router(event_router, prefix="/event")
# app.include_router(review_router, prefix="/review")
# app.include_router(password_reset_router, prefix="/password_reset")
# app.include_router(notifications_router, prefix="/notifications")
# app.include_router(emergency_contact_router, prefix="/emergency_contact")
# app.include_router(volunteer_router, prefix="/volunteer")
# # app.include_router(volunteer_opportunity_router, prefix="/volunteer_opportunity")
# app.include_router(opportunities_router, prefix="/opportunities", tags=["opportunities"])
# app.include_router(donation_router, prefix='/payments')

import logging
import time
from contextlib import asynccontextmanager, contextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from routers.auth.routes import router as auth_router
from routers.user import router as user_router
from routers.child import router as child_router
from routers.activities import router as activity_router
from routers.events import router as event_router
from routers.reviews import router as review_router
from routers.password_reset import router as password_reset_router
from routers.notifications import router as notifications_router
from routers.emergency_contact import router as emergency_contact_router
from routers.volunteer import router as volunteer_router
from routers.volunteer_opportunity import router as opportunities_router
from routers.payments import router as donation_router

from routers.notifications import start_scheduler, scheduler
from db.prisma_client import db


# --------- Logging and Timers ---------
log = logging.getLogger("perf")
# On Render everything goes to stdout, so the basic setup is ok
logging.basicConfig(level=logging.INFO)

@contextmanager
def timer(label: str):
    """Simple context timer: timer("db.events.find_many")"""
    t0 = time.perf_counter()
    try:
        yield
    finally:
        dt = (time.perf_counter() - t0) * 1000
        log.info(f"[TIMER] {label} took {dt:.1f} ms")


# --------- Application life cycle ---------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await db.connect()
    start_scheduler()
    log.info("[LIFE] startup complete")
    try:
        yield
    finally:
        # shutdown (MUST be inside finally, otherwise it may not be called)
        try:
            scheduler.shutdown(wait=False)
        except Exception as e:
            log.warning(f"[LIFE] scheduler shutdown error: {e}")
        try:
            await db.disconnect()
        except Exception as e:
            log.warning(f"[LIFE] db disconnect error: {e}")
        log.info("[LIFE] shutdown complete")


# Инстанс FastAPI
app = FastAPI(lifespan=lifespan)


# --------- CORS ---------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://wonderhood-frontend.onrender.com",
        "https://whproject.org",
        "https://www.whproject.org",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------- Middleware to measure each HTTP request ---------
@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    t0 = time.perf_counter()
    resp: Response = await call_next(request)
    total_ms = (time.perf_counter() - t0) * 1000
    log.info(f"[REQ] {request.method} {request.url.path} -> {resp.status_code} in {total_ms:.1f} ms")
    return resp


# --------- Health и root ---------
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def read_root():
    return {"Hello": "World"}


# --------- Routers ---------
app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/user")
app.include_router(child_router, prefix="/child")
app.include_router(activity_router, prefix="/activity")
app.include_router(event_router, prefix="/event")
app.include_router(review_router, prefix="/review")
app.include_router(password_reset_router, prefix="/password_reset")
app.include_router(notifications_router, prefix="/notifications")
app.include_router(emergency_contact_router, prefix="/emergency_contact")
app.include_router(volunteer_router, prefix="/volunteer")
app.include_router(opportunities_router, prefix="/opportunities", tags=["opportunities"])
app.include_router(donation_router, prefix="/payments")
