from sqlalchemy import Column, Integer, String
from Database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    endereco = Column(String, nullable=False)
    bairro = Column(String, nullable=False)
    cidade = Column(String, nullable=False)
    estado = Column(String, nullable=False)
    celular = Column(String, nullable=False)
    cpf_cnpj = Column(String, nullable=False, unique=True)
    inscricao_estadual = Column(String, nullable=True)  # único campo opcional