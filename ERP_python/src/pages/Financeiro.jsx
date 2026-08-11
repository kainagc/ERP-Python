// src/pages/Financeiro.jsx
import './Financeiro.css'
export function Financeiro() {
  return (
    <div className="princ_finan">
        <div className="lat_finan">
            <div className="div_bot_novo">
                <button className="bot_novo_finan">Novo Orçamento</button>
            </div>
            <br>
            </br>
            <div className="div_bot_filtro">
                <button className="bot_filtro_finan">Filtro</button>
            </div>
        </div>
        <div className="inf_finan">
                <div className="finan">

                </div>
        </div>
        <div className="bal_finan">
                <div className="bal">
                    <p htmlFor="" className="label_bal">Balanço</p>
                </div>
                <div className="div_bal">
                    
                </div>

        </div>
    </div>    
  )
}

export default Financeiro