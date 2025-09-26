from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.auth.routes import router as auth_router
from backend.routers.user import router as user_router
from backend.routers.child import router as child_router
from backend.routers.activities import router as activity_router
from backend.routers.events import router as event_router
from backend.routers.reviews import router as review_router
from backend.routers.password_reset import router as password_reset_router
from backend.routers.notifications import router as notifications_router
from backend.routers.emergency_contact import router as emergency_contact_router
from backend.routers.volunteer import router as volunteer_router
# from backend.routers.volunteer_opportunity import router as volunteer_opportunity_router
from backend.routers.volunteer_opportunity import router as opportunities_router
from backend.db.prisma_client import db
from backend.routers.notifications import start_scheduler, scheduler
from contextlib import asynccontextmanager

# When we start the app, connect to the db. When we shut down the app, disconnect
# @app.on_event("startup")
@asynccontextmanager
async def lifespan(app:FastAPI):
    await db.connect()

    # Start APScheduler here:
    start_scheduler()
    yield

# @asynccontextmanager
# async def shutdown(app:FastAPI):
#     # Shutdown APScheduler:

    scheduler.shutdown(wait=False)
    await db.disconnect()


# instantiate FastAPI app and Prisma db client
app = FastAPI(lifespan=lifespan)

# CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://vercel.com/erikaabrandon-6148s-projects/wonderhood-project"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main routes
@app.get('/')
def read_root():
    return {"Hello": "World"}


# Routers
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
# app.include_router(volunteer_opportunity_router, prefix="/volunteer_opportunity")
app.include_router(opportunities_router, prefix="/opportunities", tags=["opportunities"])
