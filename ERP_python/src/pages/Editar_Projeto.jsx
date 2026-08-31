import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Editar_Projeto.css'

const AMBIENTES = [
  'Sala', 'Cozinha', 'Quarto', 'Banheiro', 'Closet', 'Copa',
  'Hall de Entrada', 'Corredor', 'Lavanderia', 'Despensa',
  'Escritório', 'Lavabo', 'Espaço Gourmet', 'Churrasqueira'
]

const TIPOS_VISITA = [
  '1ª Visita', 'Confirmar Medidas', 'Entrega', 'Dúvidas', 'Manutenção'
]

const TIPOS_MATERIAL = ['MDF', 'Dobradiça', 'Corrediça', 'Vidraçaria']
const COMPRIMENTOS_CORREDICA = ['250', '300', '350', '400', '450', '500', '550']

export function Editar_Projeto() {
  const navigate = useNavigate()
  const { id } = useParams()

  const inputAmbienteRef = useRef(null)
  const input3dRef = useRef(null)

  const [ambiente, setAmbiente] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [clientes, setClientes] = useState([])
  const [buscaCliente, setBuscaCliente] = useState('')
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  // Agenda
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

  // Materiais (Modal)
  const [mostrarModalMaterial, setMostrarModalMaterial] = useState(false)
  const [tipoMaterial, setTipoMaterial] = useState('')
  const [quantidadeMaterial, setQuantidadeMaterial] = useState(1)
  const [marcaMaterial, setMarcaMaterial] = useState('')
  const [corMaterial, setCorMaterial] = useState('')
  const [tipoCorredica, setTipoCorredica] = useState('Telescópica')
  const [comprimentoCorredica, setComprimentoCorredica] = useState('450')
  const [tipoVidro, setTipoVidro] = useState('Normal')
  const [larguraVidro, setLarguraVidro] = useState('')
  const [alturaVidro, setAlturaVidro] = useState('')
  const [espessuraVidro, setEspessuraVidro] = useState('')
  const [descricaoVidro, setDescricaoVidro] = useState('')

  const [imagemAmpliada, setImagemAmpliada] = useState(null)
  const [salvando, setSalvando] = useState(false)

  // Carregar lista de clientes para a busca
  useEffect(() => {
    async function buscarClientes() {
      try {
        const resposta = await fetch('http://127.0.0.1:8000/clientes/')
        if (!resposta.ok) return
        const dados = await resposta.json()
        setClientes(dados)
      } catch (err) {
        console.error(err)
      }
    }
    buscarClientes()
  }, [])

  // Carregar dados existentes do projeto
  useEffect(() => {
    async function carregarProjeto() {
      try {
        const resposta = await fetch(`http://127.0.0.1:8000/projetos/${id}`)
        if (!resposta.ok) return
        const proj = await resposta.json()

        setAmbiente(proj.ambiente || '')
        setObservacoes(proj.observacoes || '')
        if (proj.cliente) {
          setClienteSelecionado(proj.cliente)
          setBuscaCliente(proj.cliente.nome)
        }
        if (proj.eventos) {
          setEventos(proj.eventos)
        }
        if (proj.versoes && proj.versoes.length > 0) {
          setVersoes(proj.versoes)
          setVersaoSelecionadaId(proj.versoes[0].id)
        }
      } catch (err) {
        console.error('Erro ao carregar projeto:', err)
      }
    }
    if (id) carregarProjeto()
  }, [id])

  const sugestoes = clientes.filter(c =>
    c.nome.toLowerCase().includes(buscaCliente.toLowerCase())
  )

  function selecionarCliente(cliente) {
    setClienteSelecionado(cliente)
    setBuscaCliente(cliente.nome)
    setMostrarSugestoes(false)
  }

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

  // --- Funções Eventos ---
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

  function handleRemoverEvento(eventoId) {
    setEventos(prev => prev.filter(ev => ev.id !== eventoId))
  }

  // --- Funções Versões ---
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

  function selecionarVersao(versaoId) {
    setVersaoSelecionadaId(versaoId)
    fecharModalVersao()
  }

  function handleCriarVersao() {
    if (!nomeNovaVersao.trim()) {
      alert('Digite um nome para a versão.')
      return
    }

    const novaVersao = {
      id: Date.now(),
      nome: nomeNovaVersao.trim(),
      materiais: [],
      imagensAmbiente: [],
      imagens3D: []
    }
    setVersoes(prev => [...prev, novaVersao])
    setVersaoSelecionadaId(novaVersao.id)
    fecharModalVersao()
  }

  // --- Funções Materiais ---
  function abrirModalMaterial() {
    if (!versaoSelecionadaId) {
      alert('Selecione uma versão antes de adicionar materiais.')
      return
    }
    setMostrarModalMaterial(true)
  }

  function fecharModalMaterial() {
    setMostrarModalMaterial(false)
    setTipoMaterial('')
    setQuantidadeMaterial(1)
    setMarcaMaterial('')
    setCorMaterial('')
    setTipoCorredica('Telescópica')
    setComprimentoCorredica('450')
    setTipoVidro('Normal')
    setLarguraVidro('')
    setAlturaVidro('')
    setEspessuraVidro('')
    setDescricaoVidro('')
  }

  function handleAdicionarMaterial() {
    if (!tipoMaterial) {
      alert('Selecione o tipo de material.')
      return
    }

    const qtd = Number(quantidadeMaterial) || 1

    let novoMaterial = {
      id: Date.now(),
      tipo: tipoMaterial,
      quantidade: qtd
    }

    if (tipoMaterial === 'MDF') {
      if (!marcaMaterial.trim() || !corMaterial.trim()) {
        alert('Preencha a marca e a cor do MDF.')
        return
      }
      novoMaterial.marca = marcaMaterial.trim()
      novoMaterial.cor = corMaterial.trim()
      novoMaterial.resumo = `MDF ${marcaMaterial} - Cor: ${corMaterial} (${qtd}x)`
    } else if (tipoMaterial === 'Dobradiça') {
      if (!marcaMaterial.trim()) {
        alert('Preencha a marca da dobradiça.')
        return
      }
      novoMaterial.marca = marcaMaterial.trim()
      novoMaterial.resumo = `Dobradiça ${marcaMaterial} (${qtd}x)`
    } else if (tipoMaterial === 'Corrediça') {
      if (!marcaMaterial.trim()) {
        alert('Preencha a marca da corrediça.')
        return
      }
      novoMaterial.marca = marcaMaterial.trim()
      novoMaterial.tipoCorredica = tipoCorredica
      novoMaterial.comprimento = comprimentoCorredica
      novoMaterial.resumo = `Corrediça ${tipoCorredica} ${comprimentoCorredica}mm (${marcaMaterial}) (${qtd}x)`
    } else if (tipoMaterial === 'Vidraçaria') {
      if (!larguraVidro || !alturaVidro || !espessuraVidro) {
        alert('Preencha largura, altura e espessura do vidro.')
        return
      }
      novoMaterial.subtipo = tipoVidro
      novoMaterial.largura = larguraVidro
      novoMaterial.altura = alturaVidro
      novoMaterial.espessura = espessuraVidro
      novoMaterial.descricao = descricaoVidro.trim()
      novoMaterial.resumo = `Vidro / Espelho ${tipoVidro} (${larguraVidro}x${alturaVidro}mm - ${espessuraVidro}mm) (${qtd}x)${descricaoVidro ? ` - ${descricaoVidro}` : ''}`
    }

    setVersoes(prev =>
      prev.map(v => {
        if (v.id === versaoSelecionadaId) {
          return {
            ...v,
            materiais: [...(v.materiais || []), novoMaterial]
          }
        }
        return v
      })
    )

    fecharModalMaterial()
  }

  function handleRemoverMaterial(materialId) {
    setVersoes(prev =>
      prev.map(v => {
        if (v.id === versaoSelecionadaId) {
          return {
            ...v,
            materiais: (v.materiais || []).filter(m => m.id !== materialId)
          }
        }
        return v
      })
    )
  }

  // --- Funções Imagens ---
  function handleUploadImagem(e, tipo) {
    if (!versaoSelecionadaId) {
      alert('Selecione uma versão antes de adicionar imagens.')
      return
    }

    const arquivos = Array.from(e.target.files)
    if (arquivos.length === 0) return

    const novasImagens = arquivos.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
      nome: file.name
    }))

    setVersoes(prev =>
      prev.map(v => {
        if (v.id === versaoSelecionadaId) {
          const campo = tipo === 'ambiente' ? 'imagensAmbiente' : 'imagens3D'
          return {
            ...v,
            [campo]: [...(v[campo] || []), ...novasImagens]
          }
        }
        return v
      })
    )

    e.target.value = null
  }

  function handleRemoverImagem(idImg, tipo, e) {
    e.stopPropagation()
    setVersoes(prev =>
      prev.map(v => {
        if (v.id === versaoSelecionadaId) {
          const campo = tipo === 'ambiente' ? 'imagensAmbiente' : 'imagens3D'
          return {
            ...v,
            [campo]: (v[campo] || []).filter(img => img.id !== idImg)
          }
        }
        return v
      })
    )
  }

  // --- Salvar Alterações ---
  async function handleSalvarAlteracoes() {
    if (!clienteSelecionado) {
      alert('Selecione um cliente.')
      return
    }
    if (!ambiente) {
      alert('Selecione o ambiente.')
      return
    }

    setSalvando(true)

    const payload = {
      ambiente: ambiente,
      observacoes: observacoes,
      cliente_id: clienteSelecionado.id,
      eventos: eventos.map(ev => ({
        data: ev.data,
        tipo: ev.tipo
      })),
      versoes: versoes.map(v => ({
        id: v.id,
        nome: v.nome,
        materiais: (v.materiais || []).map(m => ({
          tipo: m.tipo,
          quantidade: m.quantidade,
          resumo: m.resumo,
          marca: m.marca || null,
          cor: m.cor || null,
          tipo_corredica: m.tipoCorredica || null,
          comprimento: m.comprimento || null,
          subtipo_vidro: m.subtipo || null,
          largura: m.largura ? parseFloat(m.largura) : null,
          altura: m.altura ? parseFloat(m.altura) : null,
          espessura: m.espessura ? parseFloat(m.espessura) : null,
          descricao: m.descricao || null
        }))
      }))
    }

    try {
      const resposta = await fetch(`http://127.0.0.1:8000/projetos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!resposta.ok) {
        throw new Error('Erro ao salvar as alterações do projeto.')
      }

      alert('Projeto atualizado com sucesso!')
      navigate('/projetos')
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao salvar alterações.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={inputAmbienteRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*"
        onChange={(e) => handleUploadImagem(e, 'ambiente')}
      />
      <input
        type="file"
        ref={input3dRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*"
        onChange={(e) => handleUploadImagem(e, '3d')}
      />

      <div className="princ_edit_proj">
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

          {/* Agenda */}
          <div className='sup_div_agenda'>
            <div className='agenda'>
              <label>Agenda</label>
            </div>
            <div className='div_agenda'>
              {eventos.length === 0 && (
                <p className='texto_sem_eventos'>Nenhum evento agendado ainda.</p>
              )}

              {eventos.length > 0 && (
                <div className='lista_itens_cadastrados'>
                  {eventos.map(ev => (
                    <div className='item_linha_cadastrada' key={ev.id}>
                      <span className='item_texto_principal'>{formatarDiaSemana(ev.data)} - {ev.tipo}</span>
                      <button
                        className='bot_remover_item'
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

          {/* Versões e Detalhes */}
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
              
              {/* Materiais */}
              <div className='material'>
                <label>Materiais</label>
              </div>
              <div className='div_materiais'>
                {(!versaoSelecionada || !versaoSelecionada.materiais || versaoSelecionada.materiais.length === 0) ? (
                  <p className='texto_sem_eventos'>Nenhum material adicionado nesta versão.</p>
                ) : (
                  <div className='lista_itens_cadastrados'>
                    {versaoSelecionada.materiais.map(mat => (
                      <div className='item_linha_cadastrada' key={mat.id}>
                        <span className='item_texto_principal'>{mat.resumo}</span>
                        <button
                          className='bot_remover_item'
                          onClick={() => handleRemoverMaterial(mat.id)}
                          title="Remover material"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='op_materiais'>
                <div className='div_bot_adc'>
                  <button className='bot_adc' onClick={abrirModalMaterial}>Adicionar</button>
                </div>
              </div>

              {/* Imagens do Ambiente */}
              <div className='img_ambiente'>
                <label>Imagens do Ambiente</label>
              </div>
              <div className='div_img_ambiente'>
                {(!versaoSelecionada || !versaoSelecionada.imagensAmbiente || versaoSelecionada.imagensAmbiente.length === 0) ? (
                  <p className='texto_sem_eventos'>Nenhuma imagem do ambiente adicionada.</p>
                ) : (
                  <div className='grade_imagens'>
                    {versaoSelecionada.imagensAmbiente.map(img => (
                      <div
                        className='cartao_imagem'
                        key={img.id}
                        onClick={() => setImagemAmpliada(img.url)}
                        title="Clique para ampliar"
                      >
                        <img src={img.url} alt="Ambiente" />
                        <button
                          className='bot_remover_foto'
                          onClick={(e) => handleRemoverImagem(img.id, 'ambiente', e)}
                          title="Remover imagem"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='op_img_ambiente'>
                <div className='div_bot_adc'>
                  <button className='bot_adc' onClick={() => inputAmbienteRef.current?.click()}>
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Imagens 3D */}
              <div className='img_3d'>
                <label>Imagens 3D</label>
              </div>
              <div className='div_img_3d'>
                {(!versaoSelecionada || !versaoSelecionada.imagens3D || versaoSelecionada.imagens3D.length === 0) ? (
                  <p className='texto_sem_eventos'>Nenhuma imagem 3D adicionada.</p>
                ) : (
                  <div className='grade_imagens'>
                    {versaoSelecionada.imagens3D.map(img => (
                      <div
                        className='cartao_imagem'
                        key={img.id}
                        onClick={() => setImagemAmpliada(img.url)}
                        title="Clique para ampliar"
                      >
                        <img src={img.url} alt="Projeto 3D" />
                        <button
                          className='bot_remover_foto'
                          onClick={(e) => handleRemoverImagem(img.id, '3d', e)}
                          title="Remover imagem"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='op_img_3d'>
                <div className='div_bot_adc'>
                  <button className='bot_adc' onClick={() => input3dRef.current?.click()}>
                    Adicionar
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className='div_sup_salvar'>
            <div className='div_bot_salvar'>
              <button 
                className='bot_salvar' 
                onClick={handleSalvarAlteracoes}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {imagemAmpliada && (
        <div className='overlay_imagem_ampliada' onClick={() => setImagemAmpliada(null)}>
          <button className='bot_fechar_lightbox' onClick={() => setImagemAmpliada(null)}>
            ✕
          </button>
          <img
            className='conteudo_imagem_ampliada'
            src={imagemAmpliada}
            alt="Visualização ampliada"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modais de Evento, Versões e Materiais */}
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
              <button className='bot_confirmar_evento' onClick={handleAdicionarEvento}>Confirmar</button>
              <button className='bot_cancelar_evento' onClick={fecharModalEvento}>Cancelar</button>
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
                  <button className='bot_confirmar_evento' onClick={handleCriarVersao}>Confirmar</button>
                  <button
                    className='bot_cancelar_evento'
                    onClick={() => {
                      if (versoes.length === 0) fecharModalVersao()
                      else {
                        setMostrarFormNovaVersao(false)
                        setNomeNovaVersao('')
                      }
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button className='bot_cancelar_evento' onClick={fecharModalVersao}>Fechar</button>
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarModalMaterial && (
        <div className='overlay_modal' onClick={fecharModalMaterial}>
          <div className='modal_evento modal_material' onClick={(e) => e.stopPropagation()}>
            <h3 className='modal_evento_titulo'>Adicionar Material</h3>

            <div className='linha_dupla_inputs'>
              <div className='campo_tipo_visita' style={{ flex: 2 }}>
                <label htmlFor="select_mat">Material</label>
                <select
                  className='select_tipo_visita'
                  id="select_mat"
                  value={tipoMaterial}
                  onChange={(e) => {
                    setTipoMaterial(e.target.value)
                    setMarcaMaterial('')
                    setCorMaterial('')
                  }}
                >
                  <option value="" disabled>Selecione o tipo</option>
                  {TIPOS_MATERIAL.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className='campo_tipo_visita' style={{ flex: 1 }}>
                <label htmlFor="mat_qtd">Quantidade</label>
                <input
                  className='input_data_visita'
                  type="number"
                  id="mat_qtd"
                  min="1"
                  value={quantidadeMaterial}
                  onChange={(e) => setQuantidadeMaterial(e.target.value)}
                />
              </div>
            </div>

            {tipoMaterial === 'MDF' && (
              <>
                <div className='campo_tipo_visita'>
                  <label htmlFor="mat_marca_mdf">Marca</label>
                  <input
                    className='input_data_visita'
                    type="text"
                    id="mat_marca_mdf"
                    placeholder="Ex: Guararapes, Arauco, Duratex"
                    value={marcaMaterial}
                    onChange={(e) => setMarcaMaterial(e.target.value)}
                  />
                </div>
                <div className='campo_tipo_visita'>
                  <label htmlFor="mat_cor_mdf">Cor</label>
                  <input
                    className='input_data_visita'
                    type="text"
                    id="mat_cor_mdf"
                    placeholder="Ex: Carvalho Baturité, Branco Supremo"
                    value={corMaterial}
                    onChange={(e) => setCorMaterial(e.target.value)}
                  />
                </div>
              </>
            )}

            {tipoMaterial === 'Dobradiça' && (
              <div className='campo_tipo_visita'>
                <label htmlFor="mat_marca_ferragem">Marca</label>
                <input
                  className='input_data_visita'
                  type="text"
                  id="mat_marca_ferragem"
                  placeholder="Ex: Blum, FGV, Hafele, TN"
                  value={marcaMaterial}
                  onChange={(e) => setMarcaMaterial(e.target.value)}
                />
              </div>
            )}

            {tipoMaterial === 'Corrediça' && (
              <>
                <div className='campo_tipo_visita'>
                  <label htmlFor="mat_marca_corredica">Marca</label>
                  <input
                    className='input_data_visita'
                    type="text"
                    id="mat_marca_corredica"
                    placeholder="Ex: Blum, FGV, Hafele, TN"
                    value={marcaMaterial}
                    onChange={(e) => setMarcaMaterial(e.target.value)}
                  />
                </div>

                <div className='linha_dupla_inputs'>
                  <div className='campo_tipo_visita'>
                    <label htmlFor="mat_tipo_corredica">Tipo</label>
                    <select
                      className='select_tipo_visita'
                      id="mat_tipo_corredica"
                      value={tipoCorredica}
                      onChange={(e) => setTipoCorredica(e.target.value)}
                    >
                      <option value="Oculta">Oculta</option>
                      <option value="Telescópica">Telescópica</option>
                    </select>
                  </div>

                  <div className='campo_tipo_visita'>
                    <label htmlFor="mat_comp_corredica">Comprimento (mm)</label>
                    <select
                      className='select_tipo_visita'
                      id="mat_comp_corredica"
                      value={comprimentoCorredica}
                      onChange={(e) => setComprimentoCorredica(e.target.value)}
                    >
                      {COMPRIMENTOS_CORREDICA.map(comp => (
                        <option key={comp} value={comp}>{comp} mm</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {tipoMaterial === 'Vidraçaria' && (
              <>
                <div className='campo_tipo_visita'>
                  <label htmlFor="mat_tipo_vidro">Tipo de Vidro / Espelho</label>
                  <select
                    className='select_tipo_visita'
                    id="mat_tipo_vidro"
                    value={tipoVidro}
                    onChange={(e) => setTipoVidro(e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Orgânico">Orgânico</option>
                    <option value="Porta">Porta</option>
                  </select>
                </div>

                <div className='linha_dupla_inputs'>
                  <div className='campo_tipo_visita'>
                    <label htmlFor="mat_largura">Largura (mm)</label>
                    <input
                      className='input_data_visita'
                      type="number"
                      id="mat_largura"
                      placeholder="Ex: 800"
                      value={larguraVidro}
                      onChange={(e) => setLarguraVidro(e.target.value)}
                    />
                  </div>
                  <div className='campo_tipo_visita'>
                    <label htmlFor="mat_altura">Altura (mm)</label>
                    <input
                      className='input_data_visita'
                      type="number"
                      id="mat_altura"
                      placeholder="Ex: 1200"
                      value={alturaVidro}
                      onChange={(e) => setAlturaVidro(e.target.value)}
                    />
                  </div>
                </div>

                <div className='campo_tipo_visita'>
                  <label htmlFor="mat_espessura">Espessura (mm)</label>
                  <input
                    className='input_data_visita'
                    type="number"
                    id="mat_espessura"
                    placeholder="Ex: 4"
                    value={espessuraVidro}
                    onChange={(e) => setEspessuraVidro(e.target.value)}
                  />
                </div>

                <div className='campo_tipo_visita'>
                  <label htmlFor="mat_descricao_vidro">Descrição / Detalhes</label>
                  <input
                    className='input_data_visita'
                    type="text"
                    id="mat_descricao_vidro"
                    placeholder="Ex: Espelho prata com bisotê / Perfil alumínio preto"
                    value={descricaoVidro}
                    onChange={(e) => setDescricaoVidro(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className='form_evento_botoes'>
              <button className='bot_confirmar_evento' onClick={handleAdicionarMaterial}>Confirmar</button>
              <button className='bot_cancelar_evento' onClick={fecharModalMaterial}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editar_Projeto