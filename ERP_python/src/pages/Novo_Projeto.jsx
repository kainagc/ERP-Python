import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './Novo_Projeto.css'

const AMBIENTES = [
  'Sala', 'Cozinha', 'Quarto', 'Banheiro', 'Closet', 'Copa',
  'Hall de Entrada', 'Corredor', 'Lavanderia', 'Despensa',
  'Escritório', 'Lavabo', 'Espaço Gourmet', 'Churrasqueira'
]

const TIPOS_VISITA = [
  '1ª Visita', 'Confirmar Medidas', 'Entrega', 'Dúvidas', 'Manutenção'
]

export function Novo_Projeto() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  // Estados principais únicos
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [ambiente, setAmbiente] = useState('')
  const [observacoes, setObservacoes] = useState('')

  // Agenda / Eventos
  const [eventos, setEventos] = useState([])
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false)
  const [dataVisita, setDataVisita] = useState('')
  const [tipoVisita, setTipoVisita] = useState('')

  // Versões
  const [versoes, setVersoes] = useState([
    { id: 1, nome: 'Versão 1', arquivoPlanner: null, nomeArquivoPlanner: '' }
  ])
  const [versaoSelecionadaId, setVersaoSelecionadaId] = useState(1)
  const [mostrarModalVersao, setMostrarModalVersao] = useState(false)
  const [mostrarFormNovaVersao, setMostrarFormNovaVersao] = useState(false)
  const [nomeNovaVersao, setNomeNovaVersao] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/clientes/')
      .then(res => res.json())
      .then(dados => setClientes(dados))
      .catch(err => console.error('Erro ao buscar clientes:', err))
  }, [])

  function adicionarVersao() {
    const novoNum = versoes.length + 1
    setVersoes(prev => [
      ...prev,
      { id: Date.now(), nome: `Versão ${novoNum}`, arquivoPlanner: null, nomeArquivoPlanner: '' }
    ])
  }

  function formatarDiaSemana(dataStr) {
    if (!dataStr) return ''
    const data = new Date(dataStr + 'T00:00:00')
    const texto = data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
    return texto.charAt(0).toUpperCase() + texto.slice(1)
  }

  function fecharModalEvento() {
    setMostrarModalEvento(false)
    setDataVisita('')
    setTipoVisita('')
  }

  function handleAdicionarEvento() {
    if (!dataVisita || !tipoVisita) {
      alert('Selecione a data e o tipo de visita antes de confirmar.')
      return
    }

    const novoEvento = {
      id: Date.now(),
      data: dataVisita,
      tipo: tipoVisita
    }

    setEventos(prev =>
      [...prev, novoEvento].sort((a, b) => new Date(a.data) - new Date(b.data))
    )

    fecharModalEvento()
  }

  function handleRemoverEvento(id) {
    setEventos(prev => prev.filter(ev => ev.id !== id))
  }

  const versaoSelecionada = versoes.find(v => v.id === versaoSelecionadaId)

  function abrirModalVersao() {
    setMostrarFormNovaVersao(versoes.length === 0)
    setMostrarModalVersao(true)
  }

  function fecharModalVersao() {
    setMostrarModalVersao(false)
    setMostrarFormNovaVersao(false)
    setNomeNovaVersao('')
  }

  function selecionarVersao(id) {
    setVersaoSelecionadaId(id)
    fecharModalVersao()
  }

  function handleCriarVersao() {
    if (!nomeNovaVersao.trim()) {
      alert('Digite um nome para a versão.')
      return
    }

    const novaVersao = { id: Date.now(), nome: nomeNovaVersao.trim(), arquivoPlanner: null, nomeArquivoPlanner: '' }
    setVersoes(prev => [...prev, novaVersao])
    setVersaoSelecionadaId(novaVersao.id)
    fecharModalVersao()
  }

  function handleFileChange(index, file) {
    if (!file) return
    setVersoes(prev => {
      const novos = [...prev]
      novos[index] = {
        ...novos[index],
        arquivoPlanner: file,
        nomeArquivoPlanner: file.name
      }
      return novos
    })
  }

  async function handleSalvar() {
    if (!clienteId) {
      alert('Selecione um cliente para o projeto.')
      return
    }
    if (!ambiente.trim()) {
      alert('Informe o ambiente do projeto (Ex: Cozinha, Lavanderia).')
      return
    }

    setSalvando(true)

    const payload = {
      cliente_id: Number(clienteId),
      ambiente: ambiente,
      observacoes: observacoes,
      eventos: eventos.map(ev => ({ data: ev.data, tipo: ev.tipo })),
      versoes: versoes.map(v => ({
        nome: v.nome,
        materiais: []
      }))
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/projetos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Erro ao criar projeto.')
        setSalvando(false)
        return
      }

      const resProj = await res.json()
      const versoesCriadas = resProj.versoes_criadas || []

      for (let i = 0; i < versoes.length; i++) {
        const arq = versoes[i].arquivoPlanner
        if (arq && versoesCriadas[i]) {
          const vId = versoesCriadas[i].id
          const formData = new FormData()
          formData.append('file', arq)

          await fetch(`http://127.0.0.1:8000/versoes/${vId}/upload-planner/`, {
            method: 'POST',
            body: formData
          })
        }
      }

      alert('Projeto salvo com sucesso!')
      navigate('/projetos')
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao salvar projeto.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/projetos')}
          style={{ background: '#fff', border: '1px solid #ccc', padding: '0.55rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Voltar
        </button>
        <button
          onClick={handleSalvar}
          disabled={salvando}
          style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.55rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {salvando ? 'Salvando...' : 'Salvar Projeto'}
        </button>
      </div>

      {/* Informações do Projeto */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.85rem 1.2rem', fontSize: '1.1rem' }}>
          Informações do Projeto
        </h3>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Cliente *
            </label>
            <select
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            >
              <option value="">Selecione o Cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Ambiente *
            </label>
            <select
              value={ambiente}
              onChange={e => setAmbiente(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            >
              <option value="" disabled>Selecione o ambiente</option>
              {AMBIENTES.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Observações do Projeto
            </label>
            <textarea
              rows="3"
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Detalhes sobre instalação, prazos, fiações, pontos de hidráulica..."
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Seção de Agenda */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8ECE4', padding: '0.85rem 1.2rem' }}>
          <h3 style={{ color: '#8E3E23', margin: 0, fontSize: '1.1rem' }}>Agenda de Visitas / Eventos</h3>
          <button
            onClick={() => setMostrarModalEvento(true)}
            style={{ background: '#8E3E23', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            + Adicionar Evento
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {eventos.length === 0 && (
            <p style={{ color: '#888', fontStyle: 'italic', margin: 0 }}>Nenhum evento agendado ainda.</p>
          )}
          {eventos.map(ev => (
            <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{formatarDiaSemana(ev.data)}</strong> — <span style={{ color: '#666' }}>{ev.tipo}</span>
              </div>
              <button
                onClick={() => handleRemoverEvento(ev.id)}
                style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Versões e Arquivo Promob */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8ECE4', padding: '0.85rem 1.2rem' }}>
          <h3 style={{ color: '#8E3E23', margin: 0, fontSize: '1.1rem' }}>
            Versões e Arquivos do Promob (.planner)
          </h3>
          <button
            onClick={adicionarVersao}
            style={{ background: '#8E3E23', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            + Adicionar Versão
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {versoes.map((v, idx) => (
            <div key={v.id} style={{ borderBottom: idx < versoes.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 'bold', color: '#555', minWidth: '90px' }}>{v.nome}</span>
                <label style={{ background: '#fff', border: '1px solid #C05B35', color: '#C05B35', padding: '0.45rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Selecionar .planner
                  <input
                    type="file"
                    accept=".planner,.zip"
                    onChange={e => handleFileChange(idx, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ color: v.nomeArquivoPlanner ? '#27ae60' : '#888', fontSize: '0.9rem' }}>
                  {v.nomeArquivoPlanner ? `✓ ${v.nomeArquivoPlanner}` : 'Nenhum arquivo anexado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Eventos */}
      {mostrarModalEvento && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', border: '1px solid #E2A684' }}>
            <h3 style={{ color: '#8E3E23', marginTop: 0 }}>Novo Evento</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Data da Visita</label>
              <input
                type="date"
                value={dataVisita}
                onChange={e => setDataVisita(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
              {dataVisita && <small style={{ display: 'block', marginTop: '0.3rem', color: '#666' }}>{formatarDiaSemana(dataVisita)}</small>}
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Tipo de Visita</label>
              <select
                value={tipoVisita}
                onChange={e => setTipoVisita(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="" disabled>Selecione</option>
                {TIPOS_VISITA.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button onClick={fecharModalEvento} style={{ background: '#fff', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleAdicionarEvento} style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Novo_Projeto