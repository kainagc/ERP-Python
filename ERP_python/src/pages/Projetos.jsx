import { useNavigate } from 'react-router-dom'
import './Projetos.css'

export function Projetos() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="sup_proj">
        <div className="novo_proj">
          <button className="bot_novo_proj" onClick={() => navigate('/projetos/novo')}>Novo Projeto</button>
        </div>
        <div className="div_pesq_proj">
          <input type="text" className="pesq_proj" placeholder="Pesquisar Projeto" />
        </div>
      </div>
      <br />
      <br />
      <div className="inf_proj">
        <div className="proj"></div>
      </div>
    </div>
  )
}

export default Projetos