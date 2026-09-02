<<<<<<< Updated upstream
from sqlalchemy import Column, Integer, String
=======
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Date
from sqlalchemy.orm import relationship
>>>>>>> Stashed changes
from Database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
<<<<<<< Updated upstream
    nome = Column(String, nullable=False)
    endereco = Column(String, nullable=False)
    bairro = Column(String, nullable=False)
    cidade = Column(String, nullable=False)
    estado = Column(String, nullable=False)
    celular = Column(String, nullable=False)
    cpf_cnpj = Column(String, nullable=False, unique=True)
    inscricao_estadual = Column(String, nullable=True)  # único campo opcional
=======
    nome = Column(String(255), nullable=False)
    endereco = Column(String(255), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    estado = Column(String(2), nullable=True)
    celular = Column(String(50), nullable=True)
    cpf_cnpj = Column(String(50), nullable=True)
    inscricao_estadual = Column(String(50), nullable=True)

    projetos = relationship("Projeto", back_populates="cliente")
    orcamentos = relationship("Orcamento", back_populates="cliente")


class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True, index=True)
    ambiente = Column(String(255), nullable=False)
    observacoes = Column(Text, nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)

    cliente = relationship("Cliente", back_populates="projetos")
    eventos = relationship("EventoAgenda", back_populates="projeto", cascade="all, delete-orphan")
    versoes = relationship("VersaoProjeto", back_populates="projeto", cascade="all, delete-orphan")
    orcamentos = relationship("Orcamento", back_populates="projeto")


class EventoAgenda(Base):
    __tablename__ = "eventos_agenda"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date, nullable=False)
    tipo = Column(String(100), nullable=False)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)

    projeto = relationship("Projeto", back_populates="eventos")


class VersaoProjeto(Base):
    __tablename__ = "versoes_projeto"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)

    projeto = relationship("Projeto", back_populates="versoes")
    materiais = relationship("MaterialProjeto", back_populates="versao", cascade="all, delete-orphan")
    imagens = relationship("ImagemProjeto", back_populates="versao", cascade="all, delete-orphan")
    orcamentos = relationship("Orcamento", back_populates="versao")


class MaterialProjeto(Base):
    __tablename__ = "materiais_projeto"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(100), nullable=False)
    quantidade = Column(Float, nullable=False, default=1.0)
    resumo = Column(String(255), nullable=True)
    marca = Column(String(100), nullable=True)
    cor = Column(String(100), nullable=True)
    tipo_corredica = Column(String(100), nullable=True)
    comprimento = Column(String(100), nullable=True)
    subtipo_vidro = Column(String(100), nullable=True)
    largura = Column(Float, nullable=True)
    altura = Column(Float, nullable=True)
    espessura = Column(Float, nullable=True)
    descricao = Column(Text, nullable=True)
    versao_id = Column(Integer, ForeignKey("versoes_projeto.id"), nullable=False)

    versao = relationship("VersaoProjeto", back_populates="materiais")


class ImagemProjeto(Base):
    __tablename__ = "imagens_projeto"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)
    caminho = Column(String(500), nullable=False)
    versao_id = Column(Integer, ForeignKey("versoes_projeto.id"), nullable=False)

    versao = relationship("VersaoProjeto", back_populates="imagens")


class Orcamento(Base):
    __tablename__ = "orcamentos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=True)
    versao_id = Column(Integer, ForeignKey("versoes_projeto.id"), nullable=True)
    valor_total = Column(Float, default=0.0)
    observacoes = Column(Text, nullable=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="orcamentos")
    projeto = relationship("Projeto", back_populates="orcamentos")
    versao = relationship("VersaoProjeto", back_populates="orcamentos")
    itens = relationship("ItemOrcamento", back_populates="orcamento", cascade="all, delete-orphan")


class ItemOrcamento(Base):
    __tablename__ = "itens_orcamento"

    id = Column(Integer, primary_key=True, index=True)
    orcamento_id = Column(Integer, ForeignKey("orcamentos.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("materiais_projeto.id"), nullable=True)
    descricao = Column(String(255), nullable=False)
    quantidade = Column(Float, default=0.0)
    preco_unitario = Column(Float, default=0.0)
    subtotal = Column(Float, default=0.0)

    orcamento = relationship("Orcamento", back_populates="itens")
    material = relationship("MaterialProjeto")
>>>>>>> Stashed changes
