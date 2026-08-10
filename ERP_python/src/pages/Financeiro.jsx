// src/pages/Financeiro.jsx
import './Financeiro.css'

export function Financeiro({ aoNavegar }) {
  return (
    <div>
      <div className="princ_finan">
        <div className="bot-fin_ent">
          <button className="bot_ent" onClick={() => aoNavegar('financeiro-entrada')}>
            Entrada
          </button>
        </div>

        <div className="bot_fin_sai">
          <button className="bot_sai" onClick={() => aoNavegar('financeiro-saida')}>
            Saída
          </button>
        </div>

        <div className="bot_fin_not">
          <button className="bot_not" onClick={() => aoNavegar('financeiro-notas')}>
            Notas
          </button>
        </div>
      </div>
    </div>    
  )
}

export default Financeiro