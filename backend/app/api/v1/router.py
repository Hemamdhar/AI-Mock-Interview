from fastapi import APIRouter
from app.api.v1.endpoints import auth, progress, compile, interview, simulator

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(progress.router)
api_router.include_router(compile.router)
api_router.include_router(interview.router)
api_router.include_router(simulator.router)

