import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function Editar_Cliente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)

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

  useEffect(() => {
    async function carregarCliente() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/clientes/${id}`)
        if (res.ok) {
          const dados = await res.json()
          setForm({
            nome: dados.nome || '',
            endereco: dados.endereco || '',
            bairro: dados.bairro || '',
            cidade: dados.cidade || '',
            estado: dados.estado || 'PR',
            celular: dados.celular || '',
            cpf_cnpj: dados.cpf_cnpj || '',
            inscricao_estadual: dados.inscricao_estadual || ''
          })
        } else {
          alert('Cliente não encontrado.')
          navigate('/clientes')
        }
      } catch (err) {
        console.error(err)
        alert('Erro ao buscar dados do cliente.')
      } finally {
        setCarregando(false)
      }
    }
    carregarCliente()
  }, [id, navigate])

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
      const res = await fetch(`http://127.0.0.1:8000/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        alert('Cliente atualizado com sucesso!')
        navigate('/clientes')
      } else {
        alert('Erro ao atualizar cliente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao salvar cliente.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        Carregando dados do cliente...
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
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
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.85rem 1.2rem', fontSize: '1.1rem' }}>
          Editar Cliente #{id}
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
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.85rem 1.2rem', fontSize: '1.1rem' }}>
          Endereço
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

export default Editar_Cliente