from pydantic import BaseModel
from typing import Optional

<<<<<<< Updated upstream
=======

# --- Clientes ---
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
class ClienteUpdate(ClienteBase):
    pass
=======
>>>>>>> Stashed changes

class ClienteResponse(ClienteBase):
    id: int

    class Config:
<<<<<<< Updated upstream
        from_attributes = True
=======
        from_attributes = True


# --- Materiais e Eventos ---
class MaterialBase(BaseModel):
    id: Optional[int] = None
    tipo: str
    quantidade: float = 1.0
    resumo: Optional[str] = None
    marca: Optional[str] = None
    cor: Optional[str] = None
    tipo_corredica: Optional[str] = None
    comprimento: Optional[str] = None
    subtipo_vidro: Optional[str] = None
    largura: Optional[float] = None
    altura: Optional[float] = None
    espessura: Optional[float] = None
    descricao: Optional[str] = None


class EventoAgendaBase(BaseModel):
    id: Optional[int] = None
    data: date
    tipo: str


class VersaoProjetoBase(BaseModel):
    id: Optional[int] = None
    nome: str
    materiais: List[MaterialBase] = []


class ProjetoCreate(BaseModel):
    ambiente: str
    observacoes: Optional[str] = None
    cliente_id: Optional[int] = None
    eventos: List[EventoAgendaBase] = []
    versoes: List[VersaoProjetoBase] = []


# --- Orçamentos ---
class ItemOrcamentoCreate(BaseModel):
    material_id: Optional[int] = None
    descricao: str
    quantidade: float
    preco_unitario: float
    subtotal: float


class OrcamentoCreate(BaseModel):
    cliente_id: Optional[int] = None
    projeto_id: Optional[int] = None
    versao_id: Optional[int] = None
    valor_total: float
    observacoes: Optional[str] = None
    itens: List[ItemOrcamentoCreate] = []
>>>>>>> Stashed changes
