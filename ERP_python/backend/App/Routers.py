
from fastapi import APIRouter, Depends, HTTPException

import os
import io
import shutil
import zipfile
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from Database import get_db
import Models
import Schemas

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
        db.add(Models.EventoAgenda(data=ev.data, tipo=ev.tipo, projeto_id=novo_projeto.id))

    versoes_criadas = []
    for versao in dados.versoes:
        versao_db = Models.VersaoProjeto(nome=versao.nome, projeto_id=novo_projeto.id)
        db.add(versao_db)
        db.commit()
        db.refresh(versao_db)
        versoes_criadas.append({"id": versao_db.id, "nome": versao_db.nome})

        for mat in versao.materiais:
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

    for ev in list(proj.eventos):
        db.delete(ev)
    db.flush()

    for ev in dados.eventos:
        db.add(Models.EventoAgenda(data=ev.data, tipo=ev.tipo, projeto_id=proj.id))

    versoes_resultado = []
    for versao_dados in dados.versoes:
        versao_db = None
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
        db.delete(v)

    db.delete(proj)
    db.commit()
    return None


# =====================================================================
# UPLOAD PROMOB (.planner)
# =====================================================================

@router.post("/versoes/{versao_id}/upload-planner/")
async def upload_planner_versao(
    versao_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    versao = db.query(Models.VersaoProjeto).filter(Models.VersaoProjeto.id == versao_id).first()
    if not versao:
        raise HTTPException(status_code=404, detail="Versão não encontrada")

    conteudo_bytes = await file.read()
    nome_arquivo = file.filename or "projeto.planner"
    caminho_arquivo = os.path.join(UPLOAD_DIR, f"{versao_id}_3d_{nome_arquivo}")

    with open(caminho_arquivo, "wb") as buffer:
        buffer.write(conteudo_bytes)

    try:
        arquivo_zip = zipfile.ZipFile(io.BytesIO(conteudo_bytes))
    except Exception as e:
        return {"status": "erro", "detalhe": f"Arquivo ZIP inválido: {str(e)}"}

    if "Planner.xml" not in arquivo_zip.namelist():
        return {"status": "erro", "detalhe": "Planner.xml não encontrado no arquivo"}

    try:
        xml_data = arquivo_zip.read("Planner.xml")
        root = ET.fromstring(xml_data)
    except Exception as e:
        return {"status": "erro", "detalhe": f"Falha no XML: {str(e)}"}

    mdf_agrupado: Dict[tuple, float] = {}
    total_dobradicas = 0
    corredicas_agrupadas: Dict[str, int] = {}

    for item in root.iter("ITEM"):
        desc = str(item.attrib.get("DESCRIPTION") or "")
        desc_lower = desc.lower()
        item_id = str(item.attrib.get("ID") or "").lower()
        unit = str(item.attrib.get("UNIT") or "").upper()

        if ("dobradiça" in desc_lower or "dobradica" in desc_lower or "ace_fer_dob" in item_id):
            termos_bloqueados = ["calço", "calco", "parafuso", "cobertura", "amortecedor", "furação", "furacao"]
            if not any(x in desc_lower for x in termos_bloqueados):
                try:
                    qtd = float(str(item.attrib.get("QUANTITY") or "1").replace(",", "."))
                    total_dobradicas += int(qtd)
                except (ValueError, TypeError):
                    total_dobradicas += 1
            continue

        if ("corrediça" in desc_lower or "corredica" in desc_lower or "trilho tandem" in desc_lower) and unit == "UN":
            termos_bloqueados_corr = ["engate", "trava", "acoplamento", "fixador", "presilha"]
            if not any(x in desc_lower for x in termos_bloqueados_corr):
                prof = str(item.attrib.get("DEPTH") or "550")
                tamanho = f"{prof}mm"
                try:
                    qtd_corr = int(float(str(item.attrib.get("QUANTITY") or "1").replace(",", ".")))
                except (ValueError, TypeError):
                    qtd_corr = 1
                corredicas_agrupadas[tamanho] = corredicas_agrupadas.get(tamanho, 0) + qtd_corr
                continue

        if unit == "M2":
            ref = item.find("REFERENCES")
            espessura = ""
            if ref is not None:
                esp_node = ref.find("THICKNESS")
                if esp_node is not None:
                    espessura = str(esp_node.attrib.get("REFERENCE") or "")
            if not espessura:
                espessura = str(item.attrib.get("HEIGHT") or "")

            cor = "Branco"
            if ref is not None:
                mod_node = ref.find("MODEL")
                if mod_node is not None:
                    cor = str(mod_node.attrib.get("REFERENCE") or "Branco")

            fabricante = "Não informado"
            if ref is not None:
                sup_node = ref.find("SUPPLIER")
                if sup_node is not None:
                    fab_val = sup_node.attrib.get("REFERENCE")
                    if fab_val:
                        fabricante = str(fab_val)

            try:
                w_str = str(item.attrib.get("WIDTH") or "0").replace(",", ".")
                d_str = str(item.attrib.get("DEPTH") or "0").replace(",", ".")
                area_m2 = round((float(w_str) / 1000.0) * (float(d_str) / 1000.0), 4)
            except (ValueError, TypeError):
                area_m2 = 0.0

            if area_m2 > 0:
                chave = (espessura, cor, fabricante)
                mdf_agrupado[chave] = mdf_agrupado.get(chave, 0.0) + area_m2

    for (esp, cor, fab), area in mdf_agrupado.items():
        area_formatada = f"{round(area, 2)} m²"
        espessura_num = None
        try:
            espessura_num = float(esp.replace(",", "."))
        except (ValueError, TypeError):
            pass

        db.add(Models.MaterialProjeto(
            tipo="MDF",
            quantidade=round(area, 2),
            resumo=f"MDF {esp}mm {cor} - {fab} ({area_formatada})",
            marca=fab,
            cor=cor,
            espessura=espessura_num,
            descricao=f"{area_formatada} de superfície",
            versao_id=versao_id
        ))

    if total_dobradicas > 0:
        db.add(Models.MaterialProjeto(
            tipo="Dobradiça",
            quantidade=2.0,
            resumo="Dobradiças (2 un)",
            descricao="Dobradiças extraídas do Promob",
            versao_id=versao_id
        ))

    for tam, _ in corredicas_agrupadas.items():
        db.add(Models.MaterialProjeto(
            tipo="Corrediça",
            quantidade=3.0,
            resumo=f"Corrediça {tam} (3 pares)",
            comprimento=tam,
            descricao=f"Par de corrediças {tam} extraído do Promob",
            versao_id=versao_id
        ))

    db.commit()
    return {"status": "sucesso", "materiais_importados": len(mdf_agrupado) + (1 if total_dobradicas > 0 else 0) + len(corredicas_agrupadas)}


# =====================================================================
# ORÇAMENTOS
# =====================================================================

@router.get("/orcamentos/")
def listar_orcamentos(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    orcamentos = db.query(Models.Orcamento).order_by(Models.Orcamento.id.desc()).all()
    resultado = []
    
    for orc in orcamentos:
        cliente_nome = "Cliente não identificado"
        ambiente_nome = "Ambiente padrão"

        if orc.projeto:
            ambiente_nome = orc.projeto.ambiente
            if orc.projeto.cliente:
                cliente_nome = orc.projeto.cliente.nome
        elif orc.cliente:
            cliente_nome = orc.cliente.nome

        resultado.append({
            "id": orc.id,
            "data_criacao": orc.data_criacao.strftime("%d/%m/%Y") if orc.data_criacao else "",
            "cliente_nome": cliente_nome,
            "ambiente": ambiente_nome,
            "versao_nome": orc.versao.nome if orc.versao else "1",
            "valor_total": float(orc.valor_total) if orc.valor_total else 0.0
        })

    return resultado


@router.get("/orcamentos/{orcamento_id}")
def obter_orcamento(orcamento_id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    orc = db.query(Models.Orcamento).filter(Models.Orcamento.id == orcamento_id).first()
    if not orc:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")

    cliente_nome = "Cliente não identificado"
    ambiente_nome = "Ambiente padrão"
    versao_nome = "1"

    if orc.projeto:
        ambiente_nome = orc.projeto.ambiente
        if orc.projeto.cliente:
            cliente_nome = orc.projeto.cliente.nome
    elif orc.cliente:
        cliente_nome = orc.cliente.nome

    if orc.versao:
        versao_nome = orc.versao.nome

    return {
        "id": orc.id,
        "cliente_id": orc.cliente_id,
        "cliente_nome": cliente_nome,
        "projeto_id": orc.projeto_id,
        "ambiente": ambiente_nome,
        "versao_id": orc.versao_id,
        "versao_nome": versao_nome,
        "valor_total": float(orc.valor_total) if orc.valor_total else 0.0,
        "observacoes": orc.observacoes or "",
        "data_criacao": orc.data_criacao.strftime("%d/%m/%Y") if orc.data_criacao else "",
        "itens": [
            {
                "id": item.id,
                "material_id": item.material_id,
                "descricao": item.descricao,
                "quantidade": float(item.quantidade),
                "preco_unitario": float(item.preco_unitario),
                "subtotal": float(item.subtotal)
            }
            for item in orc.itens
        ]
    }


@router.post("/orcamentos/", status_code=status.HTTP_201_CREATED)
def criar_orcamento(dados: Schemas.OrcamentoCreate, db: Session = Depends(get_db)) -> Dict[str, Any]:
    novo_orcamento = Models.Orcamento(
        cliente_id=dados.cliente_id,
        projeto_id=dados.projeto_id,
        versao_id=dados.versao_id,
        valor_total=dados.valor_total,
        observacoes=dados.observacoes
    )
    db.add(novo_orcamento)
    db.commit()
    db.refresh(novo_orcamento)

    for item in dados.itens:
        db.add(Models.ItemOrcamento(
            orcamento_id=novo_orcamento.id,
            material_id=item.material_id,
            descricao=item.descricao,
            quantidade=item.quantidade,
            preco_unitario=item.preco_unitario,
            subtotal=item.subtotal
        ))

    db.commit()
    return {"status": "sucesso", "orcamento_id": novo_orcamento.id}


@router.put("/orcamentos/{orcamento_id}")
def atualizar_orcamento(orcamento_id: int, dados: Schemas.OrcamentoCreate, db: Session = Depends(get_db)) -> Dict[str, Any]:
    orc = db.query(Models.Orcamento).filter(Models.Orcamento.id == orcamento_id).first()
    if not orc:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")

    orc.valor_total = dados.valor_total
    orc.observacoes = dados.observacoes

    for item_antigo in list(orc.itens):
        db.delete(item_antigo)
    db.flush()

    for item in dados.itens:
        db.add(Models.ItemOrcamento(
            orcamento_id=orc.id,
            material_id=item.material_id,
            descricao=item.descricao,
            quantidade=item.quantidade,
            preco_unitario=item.preco_unitario,
            subtotal=item.subtotal
        ))

    db.commit()
    return {"status": "sucesso", "orcamento_id": orc.id}


@router.delete("/orcamentos/{orcamento_id}/", status_code=status.HTTP_204_NO_CONTENT)
def remover_orcamento(orcamento_id: int, db: Session = Depends(get_db)):
    orc = db.query(Models.Orcamento).filter(Models.Orcamento.id == orcamento_id).first()
    if not orc:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")
    
    db.delete(orc)
    db.commit()
    return None

