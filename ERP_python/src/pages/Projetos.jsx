import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Novo_Projeto.css'

export function Projetos() {
  const navigate = useNavigate()
  const [projetos, setProjetos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarProjetos()
  }, [])

  async function carregarProjetos() {
    try {
      const res = await fetch('http://127.0.0.1:8000/projetos/')
      if (res.ok) {
        const dados = await res.json()
        setProjetos(dados)
      }
    } catch (err) {
      console.error('Erro ao buscar projetos:', err)
    } finally {
      setCarregando(false)
    }
  }

  async function handleExcluir(id, e) {
    e.stopPropagation()
    if (!window.confirm(`Deseja realmente excluir o projeto #${id}?`)) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/projetos/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setProjetos(prev => prev.filter(p => p.id !== id))
      } else {
        alert('Erro ao excluir projeto.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao excluir o projeto.')
    }
  }

  const projetosFiltrados = projetos.filter(p =>
    (p.ambiente && p.ambiente.toLowerCase().includes(busca.toLowerCase())) ||
    (p.cliente_nome && p.cliente_nome.toLowerCase().includes(busca.toLowerCase())) ||
    String(p.id).includes(busca)
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Topo com Título e Botão Terracota */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ color: '#8E3E23', margin: 0 }}>Projetos</h2>
          <p style={{ color: '#666', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Gerencie e acompanhe os ambientes e arquivos técnicos
          </p>
        </div>
        <button
          onClick={() => navigate('/novo_projeto')}
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
          + Novo Projeto
        </button>
      </div>

      {/* Input de Busca */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por ambiente, cliente ou Nº..."
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

      {/* Tabela de Projetos */}
      {carregando ? (
        <p style={{ color: '#666' }}>Carregando projetos...</p>
      ) : projetosFiltrados.length === 0 ? (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: '#888', margin: 0 }}>Nenhum projeto cadastrado.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8ECE4', color: '#8E3E23', borderBottom: '1px solid #E2A684' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Nº</th>
                <th style={{ padding: '0.85rem 1rem' }}>Ambiente</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cliente</th>
                <th style={{ padding: '0.85rem 1rem' }}>Observações</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projetosFiltrados.map((proj) => (
                <tr
                  key={proj.id}
                  style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => navigate(`/projetos/${proj.id}`)}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 'bold', color: '#555' }}>#{proj.id}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#333', fontWeight: '500' }}>{proj.ambiente}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>{proj.cliente_nome}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>
                    {proj.observacoes ? (proj.observacoes.slice(0, 50) + (proj.observacoes.length > 50 ? '...' : '')) : '-'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={(e) => handleExcluir(proj.id, e)}
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

export default Projetos