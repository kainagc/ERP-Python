from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# Cliente
class ClienteBase(BaseModel):
    nome: str
    endereco: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    celular: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    inscricao_estadual: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: int
    class Config:
        from_attributes = True

# Materiais
class MaterialSchema(BaseModel):
    id: Optional[int] = None
    tipo: str
    quantidade: int = 1
    resumo: str
    marca: Optional[str] = None
    cor: Optional[str] = None
    tipo_corredica: Optional[str] = None
    comprimento: Optional[str] = None
    subtipo_vidro: Optional[str] = None
    largura: Optional[float] = None
    altura: Optional[float] = None
    espessura: Optional[float] = None
    descricao: Optional[str] = None

# Imagens
class ImagemSchema(BaseModel):
    id: int
    tipo: str
    caminho: str
    class Config:
        from_attributes = True

# Versão (com ID opcional para sabermos se já existe no banco)
class VersaoSchema(BaseModel):
    id: Optional[int] = None
    nome: str
    materiais: List[MaterialSchema] = []

# Eventos
class EventoSchema(BaseModel):
    id: Optional[int] = None
    data: date
    tipo: str

# Payload do Projeto Completo
class ProjetoCreate(BaseModel):
    ambiente: str
    observacoes: Optional[str] = None
    cliente_id: int
    eventos: List[EventoSchema] = []
    versoes: List[VersaoSchema] = []