import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< Updated upstream
import './Novo_Projeto.css'

const AMBIENTES = [
  'Sala', 'Cozinha', 'Quarto', 'Banheiro', 'Closet', 'Copa',
  'Hall de Entrada', 'Corredor', 'Lavanderia', 'Despensa',
  'Escritório', 'Lavabo', 'Espaço Gourmet', 'Churrasqueira'
]

const TIPOS_VISITA = [
  '1ª Visita', 'Confirmar Medidas', 'Entrega', 'Dúvidas', 'Manutenção'
]
=======
>>>>>>> Stashed changes

export function Novo_Projeto() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [salvando, setSalvando] = useState(false)

<<<<<<< Updated upstream
  const [ambiente, setAmbiente] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [clientes, setClientes] = useState([])
  const [buscaCliente, setBuscaCliente] = useState('')
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  const [eventos, setEventos] = useState([])
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false)
  const [dataVisita, setDataVisita] = useState('')
  const [tipoVisita, setTipoVisita] = useState('')

  // Versões
  const [versoes, setVersoes] = useState([])
  const [versaoSelecionadaId, setVersaoSelecionadaId] = useState(null)
  const [mostrarModalVersao, setMostrarModalVersao] = useState(false)
  const [mostrarFormNovaVersao, setMostrarFormNovaVersao] = useState(false)
  const [nomeNovaVersao, setNomeNovaVersao] = useState('')
=======
  const [clienteId, setClienteId] = useState('')
  const [ambiente, setAmbiente] = useState('')
  const [observacoes, setObservacoes] = useState('')

  // Versões e arquivos
  const [versoes, setVersoes] = useState([
    { id: 1, nome: 'Versão 1', arquivoPlanner: null, nomeArquivoPlanner: '' }
  ])
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  function handleBuscaChange(e) {
    setBuscaCliente(e.target.value)
    setClienteSelecionado(null)
    setMostrarSugestoes(true)
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

  // --- Versões ---
  const versaoSelecionada = versoes.find(v => v.id === versaoSelecionadaId)

  function abrirModalVersao() {
    setMostrarFormNovaVersao(versoes.length === 0) // se não tem nenhuma, já abre o form de criar
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

    const novaVersao = { id: Date.now(), nome: nomeNovaVersao.trim() }
    setVersoes(prev => [...prev, novaVersao])
    setVersaoSelecionadaId(novaVersao.id)
    fecharModalVersao()
  }

  return (
    <div>
      <div className="princ_novo_proj">
        <div className='div_sup'>
          <div className='div_bot_volt'>
            <button className='bot_voltar' onClick={() => navigate('/projetos')}>Voltar</button>
          </div>
        </div>
        <div>
          <div className='div_campos'>

            <div className='ambiente'>
              <label htmlFor="camp_ambiente">Ambiente</label>
            </div>
            <div className='div_camp_ambiente'>
              <select
                className='camp_ambiente'
                id="camp_ambiente"
                value={ambiente}
                onChange={(e) => setAmbiente(e.target.value)}
              >
                <option value="" disabled>Selecione o ambiente</option>
                {AMBIENTES.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className='cliente'>
              <label htmlFor="camp_cliente">Cliente</label>
            </div>
            <div className='div_camp_cliente' style={{ position: 'relative' }}>
              <input
                className='camp_cliente'
                type="text"
                id="camp_cliente"
                placeholder="Digite para buscar um cliente..."
                value={buscaCliente}
                onChange={handleBuscaChange}
                onFocus={() => setMostrarSugestoes(true)}
              />
              {mostrarSugestoes && buscaCliente && sugestoes.length > 0 && (
                <div className='lista_sugestoes_cliente'>
                  {sugestoes.map(c => (
                    <div
                      key={c.id}
                      className='sugestao_cliente'
                      onMouseDown={() => selecionarCliente(c)}
                    >
                      {c.nome}
                    </div>
                  ))}
                </div>
              )}
              {mostrarSugestoes && buscaCliente && sugestoes.length === 0 && (
                <div className='lista_sugestoes_cliente'>
                  <div className='sugestao_cliente sem_resultado'>Nenhum cliente encontrado</div>
                </div>
              )}
            </div>

            <div className='obs'>
              <label htmlFor="camp_obs">Observações</label>
            </div>
            <div className='div_camp_obs'>
              <input
                className='camp_obs'
                type="text"
                id="camp_obs"
                placeholder="Ex: cliente só pode ser atendido às quintas-feiras"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          <div className='sup_div_agenda'>
            <div className='agenda'>
              <label>Agenda</label>
            </div>
            <div className='div_agenda'>

              {eventos.length === 0 && (
                <p className='texto_sem_eventos'>Nenhum evento agendado ainda.</p>
              )}

              {eventos.length > 0 && (
                <div className='lista_eventos'>
                  {eventos.map(ev => (
                    <div className='item_evento' key={ev.id}>
                      <span className='item_evento_data'>{formatarDiaSemana(ev.data)}</span>
                      <span className='item_evento_tipo'>{ev.tipo}</span>
                      <button
                        className='bot_remover_evento'
                        onClick={() => handleRemoverEvento(ev.id)}
                        title="Remover evento"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className='bot_add_evento'
                onClick={() => setMostrarModalEvento(true)}
              >
                + Adicionar Evento
              </button>
            </div>
          </div>

          <div className='sup_div_versao'>
            <div className='div_bot_versao'>
              <input
                type="button"
                value={versaoSelecionada ? versaoSelecionada.nome : 'Versão'}
                className='bot_versao'
                onClick={abrirModalVersao}
              />
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
=======
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
      eventos: [],
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

      // Faz upload dos arquivos .planner de cada versão
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

      {/* Dados Principais */}
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
            <input
              type="text"
              value={ambiente}
              onChange={e => setAmbiente(e.target.value)}
              placeholder="Ex: Cozinha Planejada, Lavanderia..."
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
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
>>>>>>> Stashed changes
          </div>
        </div>
      </div>

<<<<<<< Updated upstream
      {mostrarModalEvento && (
        <div className='overlay_modal' onClick={fecharModalEvento}>
          <div className='modal_evento' onClick={(e) => e.stopPropagation()}>
            <h3 className='modal_evento_titulo'>Novo Evento</h3>

            <div className='campo_data_visita'>
              <label htmlFor="camp_data_visita">Data da Visita</label>
              <input
                className='input_data_visita'
                type="date"
                id="camp_data_visita"
                value={dataVisita}
                onChange={(e) => setDataVisita(e.target.value)}
              />
              {dataVisita && (
                <span className='texto_dia_semana'>{formatarDiaSemana(dataVisita)}</span>
              )}
            </div>

            <div className='campo_tipo_visita'>
              <label htmlFor="camp_tipo_visita">Tipo de Visita</label>
              <select
                className='select_tipo_visita'
                id="camp_tipo_visita"
                value={tipoVisita}
                onChange={(e) => setTipoVisita(e.target.value)}
              >
                <option value="" disabled>Selecione</option>
                {TIPOS_VISITA.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className='form_evento_botoes'>
              <button className='bot_confirmar_evento' onClick={handleAdicionarEvento}>
                Confirmar
              </button>
              <button className='bot_cancelar_evento' onClick={fecharModalEvento}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalVersao && (
        <div className='overlay_modal' onClick={fecharModalVersao}>
          <div className='modal_versao' onClick={(e) => e.stopPropagation()}>
            <h3 className='modal_evento_titulo'>Versões</h3>

            {!mostrarFormNovaVersao && (
              <>
                {versoes.length > 0 && (
                  <div className='lista_versoes'>
                    {versoes.map(v => (
                      <button
                        key={v.id}
                        className={`item_versao ${v.id === versaoSelecionadaId ? 'item_versao_ativa' : ''}`}
                        onClick={() => selecionarVersao(v.id)}
                      >
                        {v.nome}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className='bot_add_evento'
                  onClick={() => setMostrarFormNovaVersao(true)}
                >
                  + Criar Nova Versão
                </button>
              </>
            )}

            {mostrarFormNovaVersao && (
              <div className='campo_tipo_visita'>
                <label htmlFor="camp_nome_versao">Nome da Versão</label>
                <input
                  className='input_data_visita'
                  type="text"
                  id="camp_nome_versao"
                  placeholder="Ex: Versão 1"
                  value={nomeNovaVersao}
                  onChange={(e) => setNomeNovaVersao(e.target.value)}
                />
              </div>
            )}

            <div className='form_evento_botoes'>
              {mostrarFormNovaVersao ? (
                <>
                  <button className='bot_confirmar_evento' onClick={handleCriarVersao}>
                    Confirmar
                  </button>
                  <button
                    className='bot_cancelar_evento'
                    onClick={() => {
                      if (versoes.length === 0) {
                        fecharModalVersao()
                      } else {
                        setMostrarFormNovaVersao(false)
                        setNomeNovaVersao('')
                      }
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button className='bot_cancelar_evento' onClick={fecharModalVersao}>
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
=======
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
>>>>>>> Stashed changes
    </div>
  )
}

export default Novo_Projeto