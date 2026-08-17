import './Novo_Cliente.css'
export function Novo_Cliente({aoNavegar}) {
  return (
    <div>
        <div className="princ_novo_cli">
            <div className='div_sup'>
                <div className='div_bot_volt'>
                    <button className='bot_voltar' onClick={() => aoNavegar('clientes')}>Voltar</button>
                </div>
            </div>
            <div className='div_campos'>
                <div className='nome'>
                    <label htmlFor="">Nome</label>
                </div>
                <div className='div_camp_nome'>
                    <input className='camp_nome' type="text" name="camp_nome" id=""/>
                </div>
                <div className='end'>
                    <label htmlFor="">Endereço</label>
                </div>
                <div className='div_camp_end'>
                    <input className='camp_end' type="text" name="camp_end" id="" />
                </div>
                <div className='cel'>
                    <label htmlFor="">Celular</label>
                </div>
                <div className='div_camp_cel'>
                    <input className='camp_cel' type="text" name="camp_cel" id="" />
                </div>
                <div className='cpf'>
                    <label htmlFor="">CPF/CNPJ</label>
                </div>
                <div className='div_camp_cpf'>
                    <input className='camp_cpf' type="text" name="camp_cpf/cnpj" id="" />
                </div>
                <div className='insc'>
                    <label htmlFor="">Inscrição Estadual</label>
                </div>
                <div className='div_camp_insc'>
                    <input className='camp_insc' type="text" name="camp_insc" id="" />
                </div>
                <div className='div_bot_salvar'>
                    <button className='bot_salvar'>Salvar</button>
                </div>
            </div>
        </div>
    </div>    
  )
}

export default Novo_Cliente