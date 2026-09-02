import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Orcamento() {
  const navigate = useNavigate()
  const [orcamentos, setOrcamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarOrcamentos()
  }, [])

  async function carregarOrcamentos() {
    try {
      const res = await fetch('http://127.0.0.1:8000/orcamentos/')
      if (res.ok) {
        const dados = await res.json()
        setOrcamentos(dados)
      }
    } catch (err) {
      console.error('Erro ao buscar orçamentos:', err)
    } finally {
      setCarregando(false)
    }
  }

  async function handleExcluir(id, e) {
    e.stopPropagation()
    if (!window.confirm(`Deseja realmente excluir o orçamento #${id}?`)) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/orcamentos/${id}/`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setOrcamentos(prev => prev.filter(o => o.id !== id))
      } else {
        alert('Erro ao excluir orçamento.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao excluir orçamento.')
    }
  }

  const orcamentosFiltrados = orcamentos.filter(o =>
    (o.cliente_nome && o.cliente_nome.toLowerCase().includes(busca.toLowerCase())) ||
    (o.ambiente && o.ambiente.toLowerCase().includes(busca.toLowerCase())) ||
    String(o.id).includes(busca)
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ color: '#8E3E23', margin: 0 }}>Orçamentos</h2>
          <p style={{ color: '#666', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Gerencie e visualize as propostas comerciais geradas
          </p>
        </div>
        <button
          onClick={() => navigate('/novo_orcamento')}
          style={{
            backgroundColor: '#C05B35',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Novo Orçamento
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por cliente, ambiente ou Nº..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '0.55rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />
      </div>

      {carregando ? (
        <p style={{ color: '#666' }}>Carregando orçamentos...</p>
      ) : orcamentosFiltrados.length === 0 ? (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: '#888', margin: 0 }}>Nenhum orçamento encontrado.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8ECE4', color: '#8E3E23', borderBottom: '1px solid #E2A684' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Nº</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cliente</th>
                <th style={{ padding: '0.85rem 1rem' }}>Ambiente</th>
                <th style={{ padding: '0.85rem 1rem' }}>Versão</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Valor Total</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orcamentosFiltrados.map((orc) => (
                <tr
                  key={orc.id}
                  style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => navigate(`/orcamento/${orc.id}`)}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 'bold', color: '#555' }}>#{orc.id}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#333' }}>{orc.cliente_nome}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>{orc.ambiente}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>{orc.versao_nome}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                    {orc.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={(e) => handleExcluir(orc.id, e)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #e74c3c',
                        color: '#e74c3c',
                        borderRadius: '4px',
                        padding: '0.25rem 0.6rem',
                        cursor: 'pointer'
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Orcamento