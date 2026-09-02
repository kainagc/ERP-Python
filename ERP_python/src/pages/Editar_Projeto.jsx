import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function Editar_Projeto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const [clienteId, setClienteId] = useState('')
  const [ambiente, setAmbiente] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [versoes, setVersoes] = useState([])

  // Estado para inserção manual de material por versão
  const [novoMat, setNovoMat] = useState({
    tipo: 'MDF',
    quantidade: 1,
    resumo: '',
    marca: '',
    cor: '',
    comprimento: '',
    tipo_corredica: '',
    subtipo_vidro: '',
    espessura: ''
  })

  useEffect(() => {
    async function carregarDados() {
      try {
        const resCli = await fetch('http://127.0.0.1:8000/clientes/')
        if (resCli.ok) {
          setClientes(await resCli.json())
        }

        const resProj = await fetch(`http://127.0.0.1:8000/projetos/${id}`)
        if (resProj.ok) {
          const proj = await resProj.json()
          setAmbiente(proj.ambiente || '')
          setObservacoes(proj.observacoes || '')
          if (proj.cliente && proj.cliente.id) {
            setClienteId(proj.cliente.id)
          }
          if (proj.versoes && Array.isArray(proj.versoes)) {
            setVersoes(proj.versoes.map(v => ({
              id: v.id,
              nome: v.nome || 'Versão',
              materiais: v.materiais || [],
              arquivoPlanner: null,
              nomeArquivoPlanner: ''
            })))
          }
        } else {
          alert('Projeto não encontrado.')
          navigate('/projetos')
        }
      } catch (err) {
        console.error('Erro ao carregar projeto:', err)
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
  }, [id, navigate])

  function adicionarVersao() {
    const novoNum = versoes.length + 1
    setVersoes(prev => [
      ...prev,
      { id: Date.now(), nome: `Versão ${novoNum}`, materiais: [], arquivoPlanner: null, nomeArquivoPlanner: '' }
    ])
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

  function adicionarMaterialManual(versaoIndex, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!novoMat.resumo.trim()) {
      alert('Informe o resumo ou descrição do material.')
      return
    }

    const itemParaAdicionar = {
      tipo: novoMat.tipo,
      quantidade: Number(novoMat.quantidade) || 1,
      resumo: novoMat.resumo,
      marca: novoMat.marca,
      cor: novoMat.cor,
      comprimento: novoMat.comprimento,
      tipo_corredica: novoMat.tipo_corredica,
      subtipo_vidro: novoMat.subtipo_vidro,
      espessura: novoMat.espessura ? Number(novoMat.espessura) : null,
      descricao: `${novoMat.tipo} - ${novoMat.resumo}`
    }

    setVersoes(prev => {
      const novos = [...prev]
      const listaAtual = novos[versaoIndex].materiais || []
      
      novos[versaoIndex] = {
        ...novos[versaoIndex],
        materiais: [...listaAtual, itemParaAdicionar]
      }
      return novos
    })

    // Reseta o formulário manual
    setNovoMat({
      tipo: 'MDF',
      quantidade: 1,
      resumo: '',
      marca: '',
      cor: '',
      comprimento: '',
      tipo_corredica: '',
      subtipo_vidro: '',
      espessura: ''
    })
  }

  function removerMaterial(versaoIndex, matIndex) {
    setVersoes(prev => {
      const novos = [...prev]
      novos[versaoIndex].materiais = novos[versaoIndex].materiais.filter((_, i) => i !== matIndex)
      return novos
    })
  }

  async function handleSalvar() {
    if (!ambiente.trim()) {
      alert('O ambiente do projeto é obrigatório.')
      return
    }

    setSalvando(true)

    const payload = {
      cliente_id: clienteId ? Number(clienteId) : null,
      ambiente: ambiente,
      observacoes: observacoes,
      eventos: [],
      versoes: versoes.map(v => ({
        id: v.id < 1_000_000_000_000 ? v.id : null,
        nome: v.nome,
        materiais: v.materiais || []
      }))
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/projetos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        alert('Erro ao atualizar projeto.')
        setSalvando(false)
        return
      }

      const resAtualizada = await res.json()
      const versoesAtualizadas = resAtualizada.versoes_criadas || []

      for (let i = 0; i < versoes.length; i++) {
        const arq = versoes[i].arquivoPlanner
        if (arq && versoesAtualizadas[i]) {
          const vId = versoesAtualizadas[i].id
          const formData = new FormData()
          formData.append('file', arq)

          await fetch(`http://127.0.0.1:8000/versoes/${vId}/upload-planner/`, {
            method: 'POST',
            body: formData
          })
        }
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

  if (carregando) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Carregando dados do projeto...</div>
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
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <h3 style={{ background: '#F8ECE4', color: '#8E3E23', margin: 0, padding: '0.85rem 1.2rem', fontSize: '1.1rem' }}>
          Editar Projeto #{id}
        </h3>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Cliente Vinculado
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
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Versões e Materiais */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8ECE4', padding: '0.85rem 1.2rem' }}>
          <h3 style={{ color: '#8E3E23', margin: 0, fontSize: '1.1rem' }}>
            Versões e Materiais do Projeto
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
            <div key={v.id} style={{ marginBottom: '2.5rem', borderBottom: idx < versoes.length - 1 ? '2px solid #E2A684' : 'none', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#8E3E23', fontSize: '1.05rem' }}>{v.nome}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ background: '#fff', border: '1px solid #C05B35', color: '#C05B35', padding: '0.4rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    Substituir .planner
                    <input
                      type="file"
                      accept=".planner,.zip"
                      onChange={e => handleFileChange(idx, e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ color: v.nomeArquivoPlanner ? '#27ae60' : '#666', fontSize: '0.85rem' }}>
                    {v.nomeArquivoPlanner ? `✓ ${v.nomeArquivoPlanner}` : `${v.materiais.length} materiais cadastrados`}
                  </span>
                </div>
              </div>

              {/* Formulário Manual Completo */}
              <div style={{ background: '#fdfbfb', padding: '1.2rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1.2rem' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.8rem' }}>
                  + Adicionar Material Manualmente
                </span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Tipo de Material</label>
                    <select
                      value={novoMat.tipo}
                      onChange={e => setNovoMat({ ...novoMat, tipo: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    >
                      <option value="MDF">MDF</option>
                      <option value="Corrediça">Corrediça</option>
                      <option value="Dobradiça">Dobradiça</option>
                      <option value="Vidraçaria">Vidraçaria</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Quantidade</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={novoMat.quantidade}
                      onChange={e => setNovoMat({ ...novoMat, quantidade: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Resumo / Descrição</label>
                    <input
                      type="text"
                      placeholder="Ex: MDF 18mm Branco Tx"
                      value={novoMat.resumo}
                      onChange={e => setNovoMat({ ...novoMat, resumo: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Marca / Fabricante</label>
                    <input
                      type="text"
                      placeholder="Ex: Guararapes / Arauco"
                      value={novoMat.marca}
                      onChange={e => setNovoMat({ ...novoMat, marca: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Cor / Acabamento</label>
                    <input
                      type="text"
                      placeholder="Ex: Branco / Amadeirado"
                      value={novoMat.cor}
                      onChange={e => setNovoMat({ ...novoMat, cor: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>

                  {novoMat.tipo === 'Corrediça' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Comprimento</label>
                        <input
                          type="text"
                          placeholder="Ex: 500mm / 550mm"
                          value={novoMat.comprimento}
                          onChange={e => setNovoMat({ ...novoMat, comprimento: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Tipo de Corrediça</label>
                        <input
                          type="text"
                          placeholder="Ex: Telescópica / Oculta"
                          value={novoMat.tipo_corredica}
                          onChange={e => setNovoMat({ ...novoMat, tipo_corredica: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                    </>
                  )}

                  {novoMat.tipo === 'Vidraçaria' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Subtipo de Vidro</label>
                      <input
                        type="text"
                        placeholder="Ex: Reflecta Bronze"
                        value={novoMat.subtipo_vidro}
                        onChange={e => setNovoMat({ ...novoMat, subtipo_vidro: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Espessura (mm)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 18 ou 6"
                      value={novoMat.espessura}
                      onChange={e => setNovoMat({ ...novoMat, espessura: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={(e) => adicionarMaterialManual(idx, e)}
                    style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    Adicionar Item ao Projeto
                  </button>
                </div>
              </div>

              {/* Tabela de Materiais da Versão */}
              {v.materiais && v.materiais.length > 0 ? (
                <div style={{ border: '1px solid #eee', borderRadius: '6px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f5eeec', color: '#8E3E23', borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '0.6rem 0.8rem' }}>Tipo</th>
                        <th style={{ padding: '0.6rem 0.8rem' }}>Resumo / Descrição</th>
                        <th style={{ padding: '0.6rem 0.8rem' }}>Detalhes (Marca/Cor/Espessura)</th>
                        <th style={{ padding: '0.6rem 0.8rem', width: '90px' }}>Qtd</th>
                        <th style={{ padding: '0.6rem 0.8rem', width: '90px', textAlign: 'center' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.materiais.map((mat, mIdx) => (
                        <tr key={mIdx} style={{ borderBottom: '1px solid #f2f2f2' }}>
                          <td style={{ padding: '0.6rem 0.8rem', fontWeight: 'bold', color: '#555' }}>{mat.tipo}</td>
                          <td style={{ padding: '0.6rem 0.8rem', color: '#333' }}>{mat.resumo || mat.descricao}</td>
                          <td style={{ padding: '0.6rem 0.8rem', color: '#666', fontSize: '0.85rem' }}>
                            {[mat.marca, mat.cor, mat.espessura ? `${mat.espessura}mm` : '', mat.comprimento, mat.subtipo_vidro]
                              .filter(Boolean)
                              .join(' | ') || '-'}
                          </td>
                          <td style={{ padding: '0.6rem 0.8rem', color: '#555' }}>{mat.quantidade}</td>
                          <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removerMaterial(idx, mIdx)}
                              style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>
                  Nenhum material cadastrado nesta versão.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Editar_Projeto