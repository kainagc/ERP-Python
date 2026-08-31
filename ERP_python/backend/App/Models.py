from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from Database import Base

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    endereco = Column(String(200), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=True)
    estado = Column(String(50), nullable=True)
    celular = Column(String(30), nullable=True)
    cpf_cnpj = Column(String(30), nullable=True)
    inscricao_estadual = Column(String(50), nullable=True)
    
    projetos = relationship("Projeto", back_populates="cliente")

class Projeto(Base):
    __tablename__ = "projetos"
    id = Column(Integer, primary_key=True, index=True)
    ambiente = Column(String(100), nullable=False)
    observacoes = Column(String(500), nullable=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)

    cliente = relationship("Cliente", back_populates="projetos")
    eventos = relationship("EventoAgenda", back_populates="projeto", cascade="all, delete-orphan")
    versoes = relationship("VersaoProjeto", back_populates="projeto", cascade="all, delete-orphan")

class EventoAgenda(Base):
    __tablename__ = "eventos_agenda"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date, nullable=False)
    tipo = Column(String(50), nullable=False)
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

class MaterialProjeto(Base):
    __tablename__ = "materiais_projeto"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)
    quantidade = Column(Integer, default=1)
    resumo = Column(String(250), nullable=False)
    marca = Column(String(100), nullable=True)
    cor = Column(String(100), nullable=True)
    tipo_corredica = Column(String(50), nullable=True)
    comprimento = Column(String(50), nullable=True)
    subtipo_vidro = Column(String(50), nullable=True)
    largura = Column(Float, nullable=True)
    altura = Column(Float, nullable=True)
    espessura = Column(Float, nullable=True)
    descricao = Column(String(250), nullable=True)
    versao_id = Column(Integer, ForeignKey("versoes_projeto.id"), nullable=False)

    versao = relationship("VersaoProjeto", back_populates="materiais")

class ImagemProjeto(Base):
    __tablename__ = "imagens_projeto"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)
    caminho = Column(String(300), nullable=False)
    versao_id = Column(Integer, ForeignKey("versoes_projeto.id"), nullable=False)

    versao = relationship("VersaoProjeto", back_populates="imagens")