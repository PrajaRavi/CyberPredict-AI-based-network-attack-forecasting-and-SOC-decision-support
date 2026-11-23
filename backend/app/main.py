from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.v1 import (
    overview,
    traffic,
    forecast,
    risk,
    alerts,
    models,
    simulation
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "FastAPI Mock Backend for CyberPredict — AI-powered cybersecurity forecasting "
        "and SOC decision support platform. Serves telemetry, risk projections, "
        "model telemetry, and simulation endpoints."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 API routers
app.include_router(overview.router, prefix=settings.API_V1_PREFIX)
app.include_router(traffic.router, prefix=settings.API_V1_PREFIX)
app.include_router(forecast.router, prefix=settings.API_V1_PREFIX)
app.include_router(risk.router, prefix=settings.API_V1_PREFIX)
app.include_router(alerts.router, prefix=settings.API_V1_PREFIX)
app.include_router(models.router, prefix=settings.API_V1_PREFIX)
app.include_router(simulation.router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend service status."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "mock-inference"
    }


@app.get("/", tags=["Root"])
def root_redirect():
    """Root endpoint welcoming the analyst and directing to OpenAPI documentation."""
    return {
        "service": settings.PROJECT_NAME,
        "documentation": "/docs",
        "apiPrefix": settings.API_V1_PREFIX,
        "status": "online"
    }
