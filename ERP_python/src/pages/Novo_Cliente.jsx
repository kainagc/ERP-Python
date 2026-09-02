import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Novo_Cliente() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: 'PR',
    celular: '',
    cpf_cnpj: '',
    inscricao_estadual: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome.trim()) {
      alert('Preencha o nome do cliente.')
      return
    }

    setSalvando(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        alert('Cliente cadastrado com sucesso!')
        navigate('/clientes')
      } else {
        alert('Erro ao salvar cliente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao salvar cliente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Barra de Ações Superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/clientes')}
          style={{ background: '#fff', border: '1px solid #ccc', padding: '0.55rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={salvando}
          style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.55rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {salvando ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>

      {/* Seção 1: Dados Pessoais / Comerciais */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.85rem 1.2rem', fontSize: '1.1rem' }}>
          Identificação do Cliente
        </h3>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Nome Completo / Razão Social *
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Celular / WhatsApp
            </label>
            <input
              type="text"
              name="celular"
              value={form.celular}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              CPF / CNPJ
            </label>
            <input
              type="text"
              name="cpf_cnpj"
              value={form.cpf_cnpj}
              onChange={handleChange}
              placeholder="000.000.000-00"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Inscrição Estadual
            </label>
            <input
              type="text"
              name="inscricao_estadual"
              value={form.inscricao_estadual}
              onChange={handleChange}
              placeholder="Isento ou Nº"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* Seção 2: Endereço */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.85rem 1.2rem', fontSize: '1.1rem' }}>
          Endereço de Atendimento / Obra
        </h3>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Rua e Número
            </label>
            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua Exemplo, 123"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Bairro
            </label>
            <input
              type="text"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              placeholder="Bairro"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Cidade
            </label>
            <input
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              placeholder="Cidade"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Estado (UF)
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            >
              <option value="PR">Paraná (PR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="SP">São Paulo (SP)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Novo_Cliente