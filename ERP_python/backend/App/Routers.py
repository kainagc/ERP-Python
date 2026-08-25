from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from Database import get_db
import Models
import Schemas

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/", response_model=Schemas.ClienteResponse)
def criar_cliente(cliente: Schemas.ClienteCreate, db: Session = Depends(get_db)):
    novo_cliente = Models.Cliente(**cliente.dict())
    db.add(novo_cliente)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Já existe um cliente cadastrado com esse CPF/CNPJ.")
    db.refresh(novo_cliente)
    return novo_cliente

@router.get("/", response_model=list[Schemas.ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Models.Cliente).all()

@router.get("/{cliente_id}", response_model=Schemas.ClienteResponse)
def buscar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Models.Cliente).filter(Models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@router.put("/{cliente_id}", response_model=Schemas.ClienteResponse)
def atualizar_cliente(cliente_id: int, dados: Schemas.ClienteUpdate, db: Session = Depends(get_db)):
    cliente = db.query(Models.Cliente).filter(Models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    for campo, valor in dados.dict().items():
        setattr(cliente, campo, valor)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Já existe um cliente cadastrado com esse CPF/CNPJ.")
    db.refresh(cliente)
    return cliente