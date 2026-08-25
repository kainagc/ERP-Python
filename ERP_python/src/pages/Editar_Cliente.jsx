import { useState, useEffect } from 'react'
import './Novo_Cliente.css' // reaproveita o mesmo CSS do formulário de novo cliente

export function Editar_Cliente({ aoNavegar, clienteId }) {
  const [form, setForm] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscarCliente() {
      try {
        const resposta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}`)
        if (!resposta.ok) throw new Error('Cliente não encontrado')
        const dados = await resposta.json()
        setForm({ ...dados, inscricao_estadual: dados.inscricao_estadual || '' })
      } catch (err) {
        console.error(err)
        setErro('Não foi possível carregar os dados do cliente.')
      } finally {
        setCarregando(false)
      }
    }

    if (clienteId) buscarCliente()
  }, [clienteId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSalvar() {
    try {
      const resposta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          inscricao_estadual: form.inscricao_estadual || null
        })
      })

      if (!resposta.ok) {
        const dadosErro = await resposta.json()
        alert(dadosErro.detail || 'Erro ao salvar alterações.')
        return
      }

      alert('Cliente atualizado com sucesso!')
      aoNavegar('clientes')
    } catch (err) {
      alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
      console.error(err)
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p>{erro}</p>
  if (!form) return null

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
            <label htmlFor="camp_nome">Nome</label>
          </div>
          <div className='div_camp_nome'>
            <input className='camp_nome' type="text" name="nome" id="camp_nome"
              value={form.nome} onChange={handleChange} />
          </div>

          <div className='end'>
            <label htmlFor="camp_end">Endereço</label>
          </div>
          <div className='div_camp_end'>
            <input className='camp_end' type="text" name="endereco" id="camp_end"
              value={form.endereco} onChange={handleChange} />
          </div>

          <div className='bairro'>
            <label htmlFor="camp_bairro">Bairro</label>
          </div>
          <div className='div_camp_bairro'>
            <input className='camp_bairro' type="text" name="bairro" id="camp_bairro"
              value={form.bairro} onChange={handleChange} />
          </div>

          <div className='cidade'>
            <label htmlFor="camp_cidade">Cidade</label>
          </div>
          <div className='div_camp_cidade'>
            <input className='camp_cidade' type="text" name="cidade" id="camp_cidade"
              value={form.cidade} onChange={handleChange} />
          </div>

          <div className='estado'>
            <label htmlFor="camp_estado">Estado</label>
          </div>
          <div className='div_camp_estado'>
            <input className='camp_estado' type="text" name="estado" id="camp_estado"
              value={form.estado} onChange={handleChange} />
          </div>

          <div className='cel'>
            <label htmlFor="camp_cel">Celular</label>
          </div>
          <div className='div_camp_cel'>
            <input className='camp_cel' type="text" name="celular" id="camp_cel"
              value={form.celular} onChange={handleChange} />
          </div>

          <div className='cpf'>
            <label htmlFor="camp_cpf">CPF/CNPJ</label>
          </div>
          <div className='div_camp_cpf'>
            <input className='camp_cpf' type="text" name="cpf_cnpj" id="camp_cpf"
              value={form.cpf_cnpj} onChange={handleChange} />
          </div>

          <div className='insc'>
            <label htmlFor="camp_insc">Inscrição Estadual</label>
          </div>
          <div className='div_camp_insc'>
            <input className='camp_insc' type="text" name="inscricao_estadual" id="camp_insc"
              value={form.inscricao_estadual} onChange={handleChange} />
          </div>

          <div className='div_bot_salvar'>
            <button className='bot_salvar' onClick={handleSalvar}>Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editar_Cliente