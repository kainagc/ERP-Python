import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Novo_Projeto.css'

export function Novo_Orcamento() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [projetos, setProjetos] = useState([])
  const [versoes, setVersoes] = useState([])

  const [clienteId, setClienteId] = useState('')
  const [projetoId, setProjetoId] = useState('')
  const [versaoId, setVersaoId] = useState('')

  const [materiais, setMateriais] = useState([])
  const [observacoes, setObservacoes] = useState('')
  const [salvando, setSalvando] = useState(false)

  // 1. Carrega Clientes
  useEffect(() => {
    fetch('http://127.0.0.1:8000/clientes/')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error('Erro ao carregar clientes:', err))
  }, [])

  // 2. Carrega Projetos ao selecionar o Cliente
  useEffect(() => {
    if (!clienteId) {
      setProjetos([])
      setProjetoId('')
      setVersoes([])
      setVersaoId('')
      setMateriais([])
      return
    }

    fetch('http://127.0.0.1:8000/projetos/')
      .then(res => res.json())
      .then(data => {
        const filtrados = data.filter(p => String(p.cliente_id) === String(clienteId))
        setProjetos(filtrados)
      })
      .catch(err => console.error('Erro ao carregar projetos:', err))
  }, [clienteId])

  // 3. Carrega Versões e Materiais ao selecionar o Projeto
  useEffect(() => {
    if (!projetoId) {
      setVersoes([])
      setVersaoId('')
      setMateriais([])
      return
    }

    fetch(`http://127.0.0.1:8000/projetos/${projetoId}`)
      .then(res => res.json())
      .then(projCompleto => {
        if (projCompleto.versoes && projCompleto.versoes.length > 0) {
          setVersoes(projCompleto.versoes)
          const vPadrao = projCompleto.versoes[0]
          setVersaoId(vPadrao.id)
          inicializarMateriais(vPadrao.materiais || [])
        } else {
          setVersoes([])
          setVersaoId('')
          setMateriais([])
        }
      })
      .catch(err => console.error('Erro ao buscar detalhes do projeto:', err))
  }, [projetoId])

  // 4. Ao trocar a versão manualmente
  function handleTrocaVersao(vId) {
    setVersaoId(vId)
    const versaoSel = versoes.find(v => String(v.id) === String(vId))
    if (versaoSel) {
      inicializarMateriais(versaoSel.materiais || [])
    }
  }

  function inicializarMateriais(lista) {
    const formatados = lista.map(m => ({
      id: m.id,
      descricao: m.resumo || m.descricao || m.tipo,
      quantidade: Number(m.quantidade) || 1,
      precoUnitario: 0.0,
      subtotal: 0.0
    }))
    setMateriais(formatados)
  }

  function handlePrecoChange(index, valorStr) {
    const valorNum = parseFloat(valorStr) || 0
    setMateriais(prev => {
      const novos = [...prev]
      novos[index] = {
        ...novos[index],
        precoUnitario: valorNum,
        subtotal: novos[index].quantidade * valorNum
      }
      return novos
    })
  }

  const totalGeral = materiais.reduce((acc, item) => acc + (item.subtotal || 0), 0)

  async function handleSalvarOrcamento() {
    if (!clienteId || !projetoId || !versaoId) {
      alert('Selecione o Cliente, o Projeto e a Versão antes de salvar.')
      return
    }

    setSalvando(true)

    const payload = {
      cliente_id: Number(clienteId),
      projeto_id: Number(projetoId),
      versao_id: Number(versaoId),
      valor_total: totalGeral,
      observacoes: observacoes,
      itens: materiais.map(mat => ({
        material_id: mat.id || null,
        descricao: mat.descricao,
        quantidade: Number(mat.quantidade || 0),
        preco_unitario: Number(mat.precoUnitario || 0),
        subtotal: Number(mat.subtotal || 0)
      }))
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/orcamentos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Orçamento salvo com sucesso!')
        navigate('/orcamento')
      } else {
        const erroData = await res.json()
        alert('Erro ao salvar orçamento: ' + (erroData.detail || 'Falha no servidor'))
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao salvar orçamento.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/orcamento')}
          style={{ background: '#fff', border: '1px solid #ccc', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Voltar
        </button>
        <button
          onClick={handleSalvarOrcamento}
          disabled={salvando}
          style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {salvando ? 'Salvando...' : 'Salvar Orçamento'}
        </button>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2A684', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Cliente</label>
            <select
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Selecione o Cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Projeto / Ambiente</label>
            <select
              value={projetoId}
              onChange={e => setProjetoId(e.target.value)}
              disabled={!clienteId}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Selecione o Projeto</option>
              {projetos.map(p => (
                <option key={p.id} value={p.id}>{p.ambiente}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Versão</label>
            <select
              value={versaoId}
              onChange={e => handleTrocaVersao(e.target.value)}
              disabled={!projetoId || versoes.length === 0}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {versoes.map(v => (
                <option key={v.id} value={v.id}>{v.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.8rem 1rem' }}>
          Precificação dos Materiais Importados
        </h3>
        {materiais.length === 0 ? (
          <p style={{ padding: '1.5rem', color: '#777', textAlign: 'center', margin: 0 }}>
            Nenhum material importado encontrado para esta versão.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2A684', color: '#555' }}>
                <th style={{ padding: '0.8rem 1rem' }}>Item / Material</th>
                <th style={{ padding: '0.8rem 1rem', width: '120px' }}>Qtd</th>
                <th style={{ padding: '0.8rem 1rem', width: '150px' }}>Preço Unit. (R$)</th>
                <th style={{ padding: '0.8rem 1rem', width: '150px', textAlign: 'right' }}>Subtotal (R$)</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((mat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.8rem 1rem', color: '#333' }}>{mat.descricao}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#555' }}>{mat.quantidade}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={mat.precoUnitario || ''}
                      placeholder="0.00"
                      onChange={e => handlePrecoChange(idx, e.target.value)}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#333' }}>
                    {mat.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#fdfbfb', borderTop: '2px solid #E2A684' }}>
                <td colSpan="3" style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: '#8E3E23' }}>
                  Total Geral:
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#27ae60' }}>
                  {totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2A684' }}>
        <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.5rem' }}>
          Observações do Orçamento
        </label>
        <textarea
          rows="4"
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Condições de pagamento, prazos de entrega, validade da proposta..."
          style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
        />
      </div>
    </div>
  )
}

export default Novo_Orcamento