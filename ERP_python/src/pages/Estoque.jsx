import './Estoque.css'

export function Estoque() {
  return (
    <div className="princ_estoq">
        <div className="lat_estoq">
            <div className="div_bot_novo">
                <button className="bot_novo_estoq">Novo Produto</button>
            </div>
            <div className="div_bot_filtro">
                <button className="bot_filtro_estoq">Filtro</button>
            </div>
            <div className='div_bot_baixa'>
                <button className='bot_baixa_estoq'>Baixa</button>
            </div>

        </div>
        <div className="inf_estoq">
            <div className="div_pesq_estoq">
                <input type="text" className="pesq_estoq" placeholder="Pesquisar Produto" />
            </div>
            <div className="inf_estoq_prod">
                <div className="estoq">

                </div>
            </div>
        </div>
        <div className="bal_estoq">
                <div className="bal">
                    <p htmlFor="" className="label_bal">Balanço</p>
                </div>
                <div className="div_bal">
                    
                </div>

        </div>
    </div>      
  )
}

export default Estoque       