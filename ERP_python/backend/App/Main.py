from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Database import Base, engine
import Routers

# cria a tabela "clientes" no banco automaticamente, se não existir
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ERP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # endereço do seu front (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Routers.router)