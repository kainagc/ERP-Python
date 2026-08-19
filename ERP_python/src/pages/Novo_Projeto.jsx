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
            <div>  
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
                        <input className='camp_cliente' type="text" name="camp_cliente" id="" />
                    </div>
                    <div className='obs'>
                        <label htmlFor="">Observações</label>
                    </div>
                    <div className='div_camp_obs'>
                        <input className='camp_obs' type="text" name="camp_obs" id="" />
                    </div>
                </div>
                <div className='sup_div_agenda'>
                    <div className='agenda'>
                        <label htmlFor="">Agenda</label>
                    </div>
                    <div className='div_agenda'>

                    </div>
                </div>
                <div className='sup_div_versao'>
                    <div className='div_bot_versao'>
                        <input type="button" value="Versão" className='bot_versao'/>
                    </div>
                    <div className='div_alt_versao'>
                        <div className='material'>
                            <label htmlFor="">Materiais</label>
                        </div>
                        <div className='div_materiais'>

                        </div>
                        <div className='op_materiais'>
                            <div className='div_bot_adc'>
                                <button className='bot_adc'>Adicionar</button>
                            </div>
                            <div className='div_bot_rem'>
                                <button className='bot_rem'>Remover</button>
                            </div>
                        </div>
                        <div className='img_ambiente'>
                            <label htmlFor="">Imagems do Ambiente</label>
                        </div>
                        <div className='div_img_ambiente'>

                        </div>
                        <div className='op_img_ambiente'>
                            <div className='div_bot_adc'>
                                <button className='bot_adc'>Adicionar</button>
                            </div>
                            <div className='div_bot_rem'>
                                <button className='bot_rem'>Remover</button>
                            </div>
                        </div>
                        <div className='img_3d'>
                            <label htmlFor="">Imagens 3D</label>
                        </div>
                        <div className='div_img_3d'>

                        </div>
                        <div className='op_img_3d'>
                            <div className='div_bot_adc'>
                                <button className='bot_adc'>Adicionar</button>
                            </div>
                            <div className='div_bot_rem'>
                                <button className='bot_rem'>Remover</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='div_sup_salvar'>
                    <div className='div_bot_salvar'>
                            <button className='bot_salvar'>Salvar</button>
                    </div>
                </div>            
            </div>
        </div>
    </div>    
  )
}

export default Novo_Projeto