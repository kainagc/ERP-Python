import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Projetos.css'

export function Projetos() {
  const navigate = useNavigate()
  const [projetos, setProjetos] = useState([])
  const [pesquisa, setPesquisa] = useState('')

  useEffect(() => {
    async function buscarProjetos() {
      try {
        const resposta = await fetch('http://127.0.0.1:8000/projetos/')
        if (!resposta.ok) return
        const dados = await resposta.json()
        setProjetos(dados)
      } catch (err) {
        console.error(err)
      }
    }
    buscarProjetos()
  }, [])

  const projetosFiltrados = projetos.filter(p =>
    p.cliente_nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.ambiente.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <div>
      <div className="princ_proj">
        <div className="div_sup">
          <div className="div_bot_novo">
            <button className="bot_novo" onClick={() => navigate('/novo_projeto')}>
              Novo Projeto
            </button>
          </div>
          <div className="div_pesq">
            <input
              className="input_pesq"
              type="text"
              placeholder="Pesquisar Projeto"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </div>

        <div className="div_lista_proj">
          {projetosFiltrados.map(p => (
            <div
              key={p.id}
              className="div_proj"
              onClick={() => navigate(`/projetos/${p.id}`)}
            >
              <div className="text_proj">
                {p.cliente_nome} - {p.ambiente}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projetos