import './FinanceiroEntrada.css'

export function FinanceiroEntrada({aoNavegar}) {
  return (
    <div>
        <div className="princ_fin_entrada">
            <div className="bot_fin_entrada_bancopj">
                <button className="bot_bancopj" onClick={() => aoNavegar('financeiro-entrada-bancopj')}>
                    Banco PJ
                </button>
            </div>
            <div className="bot_fin_entrada_unicom">
                <button className="bot_Unicom" onClick={() => aoNavegar('financeiro-entrada-unicom')}>
                    Unicompem
                </button>
            </div>
            <div className="bot_fin_entrada_bancopf">
                <button className="bot_bancopf" onClick={() => aoNavegar('financeiro-entrada-bancopf')}>
                    Banco PF
                </button>
            </div>

        </div>
    </div>    
  )
}

export default FinanceiroEntrada       