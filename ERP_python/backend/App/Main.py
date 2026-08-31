from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from Database import engine, Base
import Models
import Routers
import os

# Cria as tabelas que ainda não existem
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ERP KMJ")

# Configuração ampla de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir pasta de uploads de imagens de forma estática
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Inclui as rotas
app.include_router(Routers.router)