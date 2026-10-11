from fastapi import FastAPI

app = FastAPI(
    title="KrishiMartPro API",
    description="Agriculture e-commerce platform for farmers",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Welcome to KrishiMartPro API",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KrishiMartPro Backend",
    }