// src/pages/Clientes.jsx

import './Clientes.css'
export function Clientes( {aoNavegar} ) {
  return (
    <div>
        <div className="sup_cli">
            <div className="novo_cli">
                <button className="bot_novo_cli" onClick={() => aoNavegar('novo-cliente')}>Novo Cliente</button>
            </div>
            <div className="div_pesq_cli">
                <input type="text" className="pesq_cli" placeholder="Pesquisar Cliente" />
            </div>
        </div>
        <br />
        <br />
        <div className="inf_cli">
                <div className="cli">

                </div>
        </div>
    </div>    
  )
}

export default Clientes

