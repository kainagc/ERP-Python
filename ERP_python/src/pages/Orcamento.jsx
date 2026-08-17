import './Orcamento.css'
export function Orcamento() {
  return (
    <div>
        <div className="sup_orc">
            <div className="novo_orc">
                <button className="bot_novo_orc">Novo Orçamento</button>
            </div>
            <div className="div_pesq_orc">
                <input type="text" className="pesq_orc" placeholder="Pesquisar Orçamento" />
            </div>
        </div>
        <br />
        <br />
        <div className="inf_orc">
                <div className="orc">

                </div>
        </div>
    </div>    
  )
}

export default Orcamento