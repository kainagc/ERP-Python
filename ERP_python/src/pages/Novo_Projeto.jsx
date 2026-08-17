import './Novo_Projeto.css'
export function Novo_Projeto({aoNavegar}) {
  return (
    <div>
        <div className="princ_novo_proj">
            <div className='div_sup'>
                <div className='div_bot_volt'>
                    <button className='bot_voltar' onClick={() => aoNavegar('projetos')}>Voltar</button>
                </div>
            </div>
            <div className='div_campos'>
                <div className='ambiente'>
                    <label htmlFor="">Ambiente</label>
                </div>
                <div className='div_camp_ambiente'>
                    <input className='camp_ambiente' type="text" name="camp_nome" id=""/>
                </div>
                <div className='cliente'>
                    <label htmlFor="">Cliente</label>
                </div>
                <div className='div_camp_cliente'>
                    <input className='camp_cliente' type="text" name="camp_end" id="" />
                </div>
                <div className='div_bot_salvar'>
                    <button className='bot_salvar'>Salvar</button>
                </div>
            </div>
        </div>
    </div>    
  )
}

export default Novo_Projeto