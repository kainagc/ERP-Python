import os
import shutil
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from Database import get_db
import Models
import Schemas

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =====================================================================
# CLIENTES
# =====================================================================

@router.get("/clientes/", response_model=List[Schemas.ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Models.Cliente).all()


@router.post("/clientes/", response_model=Schemas.ClienteResponse, status_code=status.HTTP_201_CREATED)
def criar_cliente(cliente: Schemas.ClienteCreate, db: Session = Depends(get_db)):
    novo_cliente = Models.Cliente(
        nome=cliente.nome,
        endereco=cliente.endereco,
        bairro=cliente.bairro,
        cidade=cliente.cidade,
        estado=cliente.estado,
        celular=cliente.celular,
        cpf_cnpj=cliente.cpf_cnpj,
        inscricao_estadual=cliente.inscricao_estadual
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente


@router.get("/clientes/{cliente_id}", response_model=Schemas.ClienteResponse)
def obter_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Models.Cliente).filter(Models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente


@router.put("/clientes/{cliente_id}", response_model=Schemas.ClienteResponse)
def atualizar_cliente(cliente_id: int, dados: Schemas.ClienteCreate, db: Session = Depends(get_db)):
    cliente = db.query(Models.Cliente).filter(Models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    cliente.nome = dados.nome
    cliente.endereco = dados.endereco
    cliente.bairro = dados.bairro
    cliente.cidade = dados.cidade
    cliente.estado = dados.estado
    cliente.celular = dados.celular
    cliente.cpf_cnpj = dados.cpf_cnpj
    cliente.inscricao_estadual = dados.inscricao_estadual

    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/clientes/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Models.Cliente).filter(Models.Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    db.delete(cliente)
    db.commit()
    return None


# =====================================================================
# PROJETOS
# =====================================================================

@router.get("/projetos/")
def listar_projetos(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    projetos = db.query(Models.Projeto).all()
    resultado = []
    for proj in projetos:
        resultado.append({
            "id": proj.id,
            "ambiente": proj.ambiente,
            "observacoes": proj.observacoes,
            "cliente_id": proj.cliente_id,
            "cliente_nome": proj.cliente.nome if proj.cliente else "Sem cliente"
        })
    return resultado


@router.get("/projetos/{projeto_id}")
def obter_projeto(projeto_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    proj = db.query(Models.Projeto).filter(Models.Projeto.id == projeto_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    return {
        "id": proj.id,
        "ambiente": proj.ambiente,
        "observacoes": proj.observacoes,
        "cliente": {
            "id": proj.cliente.id,
            "nome": proj.cliente.nome
        } if proj.cliente else None,
        "eventos": [
            {
                "id": ev.id,
                "data": str(ev.data),
                "tipo": ev.tipo
            }
            for ev in proj.eventos
        ],
        "versoes": [
            {
                "id": v.id,
                "nome": v.nome,
                "materiais": [
                    {
                        "id": m.id,
                        "tipo": m.tipo,
                        "quantidade": m.quantidade,
                        "resumo": m.resumo,
                        "marca": m.marca,
                        "cor": m.cor,
                        "tipoCorredica": m.tipo_corredica,
                        "comprimento": m.comprimento,
                        "subtipo": m.subtipo_vidro,
                        "largura": m.largura,
                        "altura": m.altura,
                        "espessura": m.espessura,
                        "descricao": m.descricao
                    }
                    for m in v.materiais
                ],
                "imagensAmbiente": [
                    {"id": img.id, "url": f"http://127.0.0.1:8000/{img.caminho}"}
                    for img in v.imagens if img.tipo == "ambiente"
                ],
                "imagens3D": [
                    {"id": img.id, "url": f"http://127.0.0.1:8000/{img.caminho}"}
                    for img in v.imagens if img.tipo == "3d"
                ]
            }
            for v in proj.versoes
        ]
    }


@router.post("/projetos/", status_code=status.HTTP_201_CREATED)
def criar_projeto(dados: Schemas.ProjetoCreate, db: Session = Depends(get_db)) -> Dict[str, Any]:
    novo_projeto = Models.Projeto(
        ambiente=dados.ambiente,
        observacoes=dados.observacoes,
        cliente_id=dados.cliente_id
    )
    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)

    for ev in dados.eventos:
        evento_db = Models.EventoAgenda(
            data=ev.data,
            tipo=ev.tipo,
            projeto_id=novo_projeto.id
        )
        db.add(evento_db)

    versoes_criadas = []
    for versao in dados.versoes:
        versao_db = Models.VersaoProjeto(
            nome=versao.nome,
            projeto_id=novo_projeto.id
        )
        db.add(versao_db)
        db.commit()
        db.refresh(versao_db)
        versoes_criadas.append({"id": versao_db.id, "nome": versao_db.nome})

        for mat in versao.materiais:
            mat_db = Models.MaterialProjeto(
                tipo=mat.tipo,
                quantidade=mat.quantidade,
                resumo=mat.resumo,
                marca=mat.marca,
                cor=mat.cor,
                tipo_corredica=mat.tipo_corredica,
                comprimento=mat.comprimento,
                subtipo_vidro=mat.subtipo_vidro,
                largura=mat.largura,
                altura=mat.altura,
                espessura=mat.espessura,
                descricao=mat.descricao,
                versao_id=versao_db.id
            )
            db.add(mat_db)

    db.commit()
    return {
        "status": "sucesso",
        "projeto_id": novo_projeto.id,
        "versoes_criadas": versoes_criadas
    }


@router.put("/projetos/{projeto_id}")
def atualizar_projeto(projeto_id: int, dados: Schemas.ProjetoCreate, db: Session = Depends(get_db)) -> Dict[str, Any]:
    proj = db.query(Models.Projeto).filter(Models.Projeto.id == projeto_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    proj.ambiente = dados.ambiente
    proj.observacoes = dados.observacoes
    proj.cliente_id = dados.cliente_id

    # 1. Agenda
    for ev in list(proj.eventos):
        db.delete(ev)
    db.flush()

    for ev in dados.eventos:
        db.add(Models.EventoAgenda(data=ev.data, tipo=ev.tipo, projeto_id=proj.id))

    # 2. Versões (preserva o histórico das versões e atualiza materiais)
    versoes_resultado = []
    for versao_dados in dados.versoes:
        versao_db = None

        # Se for ID existente do banco (não ID timestamp do front)
        if versao_dados.id and versao_dados.id < 1_000_000_000_000:
            versao_db = db.query(Models.VersaoProjeto).filter(
                Models.VersaoProjeto.id == versao_dados.id,
                Models.VersaoProjeto.projeto_id == proj.id
            ).first()

        if versao_db:
            versao_db.nome = versao_dados.nome
            for mat_antigo in list(versao_db.materiais):
                db.delete(mat_antigo)
            db.flush()
        else:
            versao_db = Models.VersaoProjeto(nome=versao_dados.nome, projeto_id=proj.id)
            db.add(versao_db)
            db.commit()
            db.refresh(versao_db)

        for mat in versao_dados.materiais:
            db.add(Models.MaterialProjeto(
                tipo=mat.tipo,
                quantidade=mat.quantidade,
                resumo=mat.resumo,
                marca=mat.marca,
                cor=mat.cor,
                tipo_corredica=mat.tipo_corredica,
                comprimento=mat.comprimento,
                subtipo_vidro=mat.subtipo_vidro,
                largura=mat.largura,
                altura=mat.altura,
                espessura=mat.espessura,
                descricao=mat.descricao,
                versao_id=versao_db.id
            ))

        versoes_resultado.append({"id": versao_db.id, "nome": versao_db.nome})

    db.commit()
    return {
        "status": "sucesso",
        "projeto_id": proj.id,
        "versoes_criadas": versoes_resultado
    }


@router.delete("/projetos/{projeto_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_projeto(projeto_id: int, db: Session = Depends(get_db)):
    proj = db.query(Models.Projeto).filter(Models.Projeto.id == projeto_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    for ev in list(proj.eventos):
        db.delete(ev)

    for v in list(proj.versoes):
        for m in list(v.materiais):
            db.delete(m)
        for img in list(v.imagens):
            db.delete(img)
        db.delete(v)

    db.delete(proj)
    db.commit()
    return None


# =====================================================================
# IMAGENS
# =====================================================================

@router.post("/versoes/{versao_id}/upload-imagem/")
def upload_imagem_versao(
    versao_id: int,
    tipo: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    caminho_arquivo = os.path.join(UPLOAD_DIR, f"{versao_id}_{tipo}_{file.filename}")
    with open(caminho_arquivo, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    img_db = Models.ImagemProjeto(
        tipo=tipo,
        caminho=caminho_arquivo.replace("\\", "/"),
        versao_id=versao_id
    )
    db.add(img_db)
    db.commit()
    db.refresh(img_db)

    return {"status": "imagem enviada", "id": img_db.id, "caminho": img_db.caminho}