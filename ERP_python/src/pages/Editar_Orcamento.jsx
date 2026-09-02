import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Novo_Projeto.css'

export function Editar_Orcamento() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [orcamento, setOrcamento] = useState(null)
  const [materiais, setMateriais] = useState([])
  const [observacoes, setObservacoes] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregarOrcamento() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/orcamentos/${id}`)
        if (res.ok) {
          const dados = await res.json()
          setOrcamento(dados)
          setObservacoes(dados.observacoes || '')
          setMateriais(dados.itens.map(i => ({
            id: i.material_id,
            descricao: i.descricao,
            quantidade: Number(i.quantidade) || 0,
            precoUnitario: Number(i.preco_unitario) || 0,
            subtotal: Number(i.subtotal) || 0
          })))
        } else {
          alert('Orçamento não encontrado.')
          navigate('/orcamento')
        }
      } catch (err) {
        console.error('Erro ao buscar orçamento:', err)
      } finally {
        setCarregando(false)
      }
    }
    carregarOrcamento()
  }, [id, navigate])

  function handleQuantidadeChange(index, valorStr) {
    const qtdNum = parseFloat(valorStr) || 0
    setMateriais(prev => {
      const novos = [...prev]
      const preco = novos[index].precoUnitario
      novos[index] = {
        ...novos[index],
        quantidade: qtdNum,
        subtotal: qtdNum * preco
      }
      return novos
    })
  }

  function handlePrecoChange(index, valorStr) {
    const precoNum = parseFloat(valorStr) || 0
    setMateriais(prev => {
      const novos = [...prev]
      const qtd = novos[index].quantidade
      novos[index] = {
        ...novos[index],
        precoUnitario: precoNum,
        subtotal: qtd * precoNum
      }
      return novos
    })
  }

  const totalGeral = materiais.reduce((acc, item) => acc + (item.subtotal || 0), 0)

  async function handleSalvarAlteracoes() {
    setSalvando(true)

    const payload = {
      cliente_id: orcamento.cliente_id,
      projeto_id: orcamento.projeto_id,
      versao_id: orcamento.versao_id,
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
      const res = await fetch(`http://127.0.0.1:8000/orcamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Orçamento atualizado com sucesso!')
        navigate('/orcamento')
      } else {
        alert('Erro ao atualizar orçamento.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao salvar alterações.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Carregando orçamento...</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/orcamento')}
          style={{ background: '#fff', border: '1px solid #ccc', padding: '0.55rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Voltar
        </button>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#fff', border: '1px solid #C05B35', color: '#C05B35', padding: '0.55rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Imprimir
          </button>
          <button
            onClick={handleSalvarAlteracoes}
            disabled={salvando}
            style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.55rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #F8ECE4', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ color: '#8E3E23', margin: 0 }}>Editar Orçamento #{orcamento?.id}</h2>
            <p style={{ color: '#666', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Modifique quantidades, preços e observações</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Data: {orcamento?.data_criacao}</p>
          </div>
        </div>

        <div style={{ background: '#F8ECE4', padding: '1rem', borderRadius: '6px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#8E3E23', fontWeight: 'bold' }}>CLIENTE</span>
            <span style={{ fontSize: '1rem', color: '#333' }}>{orcamento?.cliente_nome}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#8E3E23', fontWeight: 'bold' }}>AMBIENTE</span>
            <span style={{ fontSize: '1rem', color: '#333' }}>{orcamento?.ambiente}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#8E3E23', fontWeight: 'bold' }}>VERSÃO</span>
            <span style={{ fontSize: '1rem', color: '#333' }}>{orcamento?.versao_nome}</span>
          </div>
        </div>
      </div>

      {/* Tabela de Itens Totalmente Editáveis (Qtd e Preço Unitário) */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.8rem 1rem' }}>
          Precificação e Quantidades dos Materiais
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2A684', color: '#555' }}>
              <th style={{ padding: '0.8rem 1rem' }}>Item / Material</th>
              <th style={{ padding: '0.8rem 1rem', width: '140px' }}>Quantidade</th>
              <th style={{ padding: '0.8rem 1rem', width: '160px' }}>Preço Unit. (R$)</th>
              <th style={{ padding: '0.8rem 1rem', width: '160px', textAlign: 'right' }}>Subtotal (R$)</th>
            </tr>
          </thead>
          <tbody>
            {materiais.map((mat, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.8rem 1rem', color: '#333' }}>{mat.descricao}</td>
                <td style={{ padding: '0.8rem 1rem' }}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={mat.quantidade}
                    onChange={e => handleQuantidadeChange(idx, e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </td>
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
      </div>

      {/* Observações */}
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2A684' }}>
        <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.5rem' }}>
          Observações do Orçamento
        </label>
        <textarea
          rows="4"
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
        />
      </div>
    </div>
  )
}

export default Editar_Orcamento