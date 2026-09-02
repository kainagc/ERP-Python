import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Novo_Projeto.css'

export function Clientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarClientes()
  }, [])

  async function carregarClientes() {
    try {
      const res = await fetch('http://127.0.0.1:8000/clientes/')
      if (res.ok) {
        const dados = await res.json()
        setClientes(dados)
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setCarregando(false)
    }
  }

  async function handleExcluir(id, e) {
    e.stopPropagation()
    if (!window.confirm(`Deseja realmente excluir o cliente #${id}?`)) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/clientes/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setClientes(prev => prev.filter(c => c.id !== id))
      } else {
        alert('Erro ao excluir cliente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao excluir cliente.')
    }
  }

  const clientesFiltrados = clientes.filter(c =>
    (c.nome && c.nome.toLowerCase().includes(busca.toLowerCase())) ||
    (c.cidade && c.cidade.toLowerCase().includes(busca.toLowerCase())) ||
    (c.celular && c.celular.includes(busca)) ||
    String(c.id).includes(busca)
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Topo com Título e Botão Terracota */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ color: '#8E3E23', margin: 0 }}>Clientes</h2>
          <p style={{ color: '#666', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Gerencie e visualize o cadastro de clientes e contatos
          </p>
        </div>
        <button
          onClick={() => navigate('/novo_cliente')}
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
          + Novo Cliente
        </button>
      </div>

      {/* Input de Busca */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por cliente, cidade ou Nº..."
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

      {/* Tabela Idêntica à de Orçamentos */}
      {carregando ? (
        <p style={{ color: '#666' }}>Carregando clientes...</p>
      ) : clientesFiltrados.length === 0 ? (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: '#888', margin: 0 }}>Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8ECE4', color: '#8E3E23', borderBottom: '1px solid #E2A684' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Nº</th>
                <th style={{ padding: '0.85rem 1rem' }}>Nome</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cidade / UF</th>
                <th style={{ padding: '0.85rem 1rem' }}>Celular / WhatsApp</th>
                <th style={{ padding: '0.85rem 1rem' }}>CPF / CNPJ</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cli) => (
                <tr
                  key={cli.id}
                  style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => navigate(`/clientes/${cli.id}`)}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 'bold', color: '#555' }}>#{cli.id}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#333' }}>{cli.nome}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>
                    {cli.cidade ? `${cli.cidade} - ${cli.estado || ''}` : '-'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>{cli.celular || '-'}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>{cli.cpf_cnpj || '-'}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={(e) => handleExcluir(cli.id, e)}
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

export default Clientes