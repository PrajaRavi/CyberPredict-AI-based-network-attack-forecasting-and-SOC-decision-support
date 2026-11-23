from typing import List


class Settings:
    PROJECT_NAME: str = "CyberPredict Forecasting & SOC API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "*"
    ]


settings = Settings()
