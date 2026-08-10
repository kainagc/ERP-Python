import './Estoque.css'

export function Estoque() {
  return (
    <div>
        <div className="princ_estoq">
            <div className="bot-estq_prod">
                <button className="bot_prod">Produto</button>
            </div>
            <div className="bot_estq_pedid">
                <button className="bot_pedid">Pedido</button>
            </div>
            <div className="bot_estq_repo">
                <button className="bot_repo">Reposição</button>
            </div>

        </div>
    </div>    
  )
}

export default Estoque       