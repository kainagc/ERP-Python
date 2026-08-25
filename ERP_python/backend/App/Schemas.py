from pydantic import BaseModel
from typing import Optional

class ClienteBase(BaseModel):
    nome: str
    endereco: str
    bairro: str
    cidade: str
    estado: str
    celular: str
    cpf_cnpj: str
    inscricao_estadual: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: int

    class Config:
        from_attributes = True