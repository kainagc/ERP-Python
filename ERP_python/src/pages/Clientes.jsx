// src/pages/Clientes.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Clientes.css'

export function Clientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [termoPesquisa, setTermoPesquisa] = useState('')

  useEffect(() => {
    async function buscarClientes() {
      try {
        const resposta = await fetch('http://127.0.0.1:8000/clientes/')
        if (!resposta.ok) throw new Error('Erro ao buscar clientes')
        const dados = await resposta.json()
        setClientes(dados)
      } catch (err) {
        console.error(err)
        setErro('Não foi possível carregar os clientes. Verifique se o backend está rodando.')
      } finally {
        setCarregando(false)
      }
    }

    buscarClientes()
  }, [])

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  )

  return (
    <div>
      <div className="sup_cli">
        <div className="novo_cli">
          <button className="bot_novo_cli" onClick={() => navigate('/clientes/novo')}>Novo Cliente</button>
        </div>
        <div className="div_pesq_cli">
          <input
            type="text"
            className="pesq_cli"
            placeholder="Pesquisar Cliente"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
      </div>
      <br />
      <br />
      <div className="inf_cli">
        <div className="lista_cli">
          {carregando && <p>Carregando...</p>}
          {erro && <p>{erro}</p>}
          {!carregando && !erro && clientesFiltrados.length === 0 && (
            <p>
              {termoPesquisa
                ? 'Nenhum cliente encontrado com esse nome.'
                : 'Nenhum cliente cadastrado ainda.'}
            </p>
          )}
          {clientesFiltrados.map(cliente => (
            <div
              className="cli"
              key={cliente.id}
              onClick={() => navigate(`/clientes/${cliente.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <p>{cliente.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Clientes