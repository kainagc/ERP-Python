import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Novo_Projeto.css'

export function Financeiro() {
  const navigate = useNavigate()
  const [anoSelecionado, setAnoSelecionado] = useState('2026')
  const [mesSelecionado, setMesSelecionado] = useState('Janeiro')
  const [categoriaAtiva, setCategoriaAtiva] = useState('Unicompen')
  const [busca, setBusca] = useState('')
  const [clientes, setClientes] = useState([])

  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null) // Guarda o ID se estiver editando

  const [novoItem, setNovoItem] = useState({
    categoria: 'Unicompen',
    dia: '',
    tipoSub: 'Pedido',
    numeroPedido: '',
    descricao: '',
    clienteId: '',
    saidaPara: '',
    tipoCaixaOp: 'Nota',
    fornecedor: '',
    valor: ''
  })

  const anos = ['2024', '2025', '2026', '2027', '2028']
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const categoriasPrincipais = [
    { id: 'Unicompen', nome: 'Unicompen', icone: '📦' },
    { id: 'NotasEmitidas', nome: 'Notas Emitidas', icone: '📄' },
    { id: 'BancoPJ', nome: 'Banco (PJ/Empresa)', icone: '🏦' },
    { id: 'BancoJorge', nome: 'Banco Jorge (PF)', icone: '💳' },
    { id: 'Caixa', nome: 'Caixa', icone: '📒' },
    { id: 'Dinheiro', nome: 'Dinheiro', icone: '💵' }
  ]

  const [lancamentos, setLancamentos] = useState([
    { id: 1, categoria: 'Unicompen', ano: '2026', mes: 'Janeiro', data: '08 / Janeiro / 2026', tipoSub: 'Pedido', numeroPedido: '1042', descricao: 'Chapas MDF', valor: 2500.00 },
    { id: 2, categoria: 'Unicompen', ano: '2026', mes: 'Janeiro', data: '08 / Janeiro / 2026', tipoSub: 'Devolução', numeroPedido: '', descricao: 'Devolução chapas', valor: 400.00 },
    { id: 3, categoria: 'Unicompen', ano: '2026', mes: 'Janeiro', data: '10 / Janeiro / 2026', tipoSub: 'Em Haver', numeroPedido: '', descricao: 'Adiantamento dinheiro', valor: 1000.00 },
    { id: 4, categoria: 'NotasEmitidas', ano: '2026', mes: 'Janeiro', data: '06 / Janeiro / 2026', tipoSub: 'Nota', numeroPedido: '', descricao: 'Baitaca', valor: 12900.00 },
    { id: 5, categoria: 'BancoPJ', ano: '2026', mes: 'Janeiro', data: '07 / Janeiro / 2026', tipoSub: 'Quitação', numeroPedido: '', descricao: 'Comatol', valor: 316.00 },
    { id: 6, categoria: 'BancoPJ', ano: '2026', mes: 'Janeiro', data: '08 / Janeiro / 2026', tipoSub: 'Saída', numeroPedido: '', descricao: 'Fornecedor de chapas', valor: 1500.00 },
    { id: 7, categoria: 'BancoJorge', ano: '2026', mes: 'Janeiro', data: '07 / Janeiro / 2026', tipoSub: 'Parcela', numeroPedido: '', descricao: 'Baitaca Entrega', valor: 7900.00 },
    { id: 8, categoria: 'Caixa', ano: '2026', mes: 'Janeiro', data: '14 / Janeiro / 2026', tipoSub: 'Saída', numeroPedido: '', descricao: '[Nota] Fornecedor ABC', valor: 300.00 },
    { id: 9, categoria: 'Dinheiro', ano: '2026', mes: 'Janeiro', data: '20 / Janeiro / 2026', tipoSub: 'Entrada', numeroPedido: '', descricao: 'Claudia e Juliano', valor: 5000.00 }
  ])

  useEffect(() => {
    async function carregarClientes() {
      try {
        const res = await fetch('http://127.0.0.1:8000/clientes/')
        if (res.ok) setClientes(await res.json())
      } catch (err) {
        console.error('Erro ao buscar clientes:', err)
      }
    }
    carregarClientes()
  }, [])

  function abrirModalNovo() {
    setEditandoId(null)
    setNovoItem({
      categoria: categoriaAtiva,
      dia: '',
      tipoSub: categoriaAtiva === 'Unicompen' ? 'Pedido' : ['BancoPJ', 'BancoJorge', 'Dinheiro'].includes(categoriaAtiva) ? 'Entrada' : 'Nota',
      numeroPedido: '',
      descricao: '',
      clienteId: '',
      saidaPara: '',
      tipoCaixaOp: 'Nota',
      fornecedor: '',
      valor: ''
    })
    setModalAberto(true)
  }

  function abrirModalEditar(l) {
    setEditandoId(l.id)
    // Tenta extrair o dia da string de data "DD / Mes / Ano"
    const diaExtraido = l.data ? l.data.split('/')[0].trim() : ''
    
    setNovoItem({
      categoria: l.categoria,
      dia: diaExtraido,
      tipoSub: l.tipoSub || 'Pedido',
      numeroPedido: l.numeroPedido || '',
      descricao: l.descricao || '',
      clienteId: '',
      saidaPara: l.categoria === 'BancoPJ' && l.tipoSub === 'Saída' ? l.descricao : '',
      tipoCaixaOp: l.descricao && l.descricao.includes('[Recibo]') ? 'Recibo' : 'Nota',
      fornecedor: l.categoria === 'Caixa' ? l.descricao.replace(/\[.*?\]\s*/, '') : '',
      valor: l.valor || ''
    })
    setModalAberto(true)
  }

  function handleSalvarLancamento(e) {
    e.preventDefault()
    if (!novoItem.dia || !novoItem.valor) {
      alert('Informe pelo menos o dia e o valor.')
      return
    }

    let descFinal = novoItem.descricao
    let subType = novoItem.tipoSub

    if (novoItem.categoria === 'Unicompen' && novoItem.tipoSub === 'Pedido' && novoItem.numeroPedido) {
      descFinal = `Pedido Nº ${novoItem.numeroPedido} ${novoItem.descricao ? `- ${novoItem.descricao}` : ''}`
    } else if (['NotasEmitidas', 'BancoJorge', 'Dinheiro'].includes(novoItem.categoria)) {
      const cli = clientes.find(c => String(c.id) === String(novoItem.clienteId))
      descFinal = cli ? cli.nome : (novoItem.descricao || 'Cliente avulso')
    } else if (novoItem.categoria === 'BancoPJ' && novoItem.tipoSub === 'Saída') {
      descFinal = novoItem.saidaPara || 'Saída diversa'
    } else if (novoItem.categoria === 'BancoPJ' && ['Entrada', 'Parcela', 'Quitação'].includes(novoItem.tipoSub)) {
      const cli = clientes.find(c => String(c.id) === String(novoItem.clienteId))
      descFinal = cli ? cli.nome : (novoItem.descricao || 'Cliente avulso')
    } else if (novoItem.categoria === 'Caixa') {
      subType = 'Saída'
      descFinal = `[${novoItem.tipoCaixaOp}] ${novoItem.fornecedor || 'Fornecedor diverso'}`
    }

    const dataFormatada = `${novoItem.dia.padStart(2, '0')} / ${mesSelecionado} / ${anoSelecionado}`

    if (editandoId) {
      // Atualiza item existente
      setLancamentos(prev => prev.map(l => l.id === editandoId ? {
        ...l,
        categoria: novoItem.categoria,
        ano: anoSelecionado,
        mes: mesSelecionado,
        data: dataFormatada,
        tipoSub: subType,
        numeroPedido: novoItem.numeroPedido,
        descricao: descFinal,
        valor: parseFloat(novoItem.valor) || 0
      } : l))
    } else {
      // Cria novo item
      const itemCriado = {
        id: Date.now(),
        categoria: novoItem.categoria,
        ano: anoSelecionado,
        mes: mesSelecionado,
        data: dataFormatada,
        tipoSub: subType,
        numeroPedido: novoItem.numeroPedido,
        descricao: descFinal || 'Lançamento padrão',
        valor: parseFloat(novoItem.valor) || 0
      }
      setLancamentos(prev => [itemCriado, ...prev])
    }

    setModalAberto(false)
    setEditandoId(null)
  }

  function handleExcluir(id) {
    if (window.confirm('Deseja realmente excluir este lançamento?')) {
      setLancamentos(prev => prev.filter(l => l.id !== id))
    }
  }

  function obterCorValor(l) {
    if (l.categoria === 'Unicompen') {
      if (l.tipoSub === 'Devolução') return '#e74c3c'
      if (l.tipoSub === 'Em Haver') return '#27ae60'
      return '#2980b9'
    }
    if (l.categoria === 'BancoPJ' || l.categoria === 'Caixa') {
      if (l.tipoSub === 'Saída') return '#e74c3c'
      return '#27ae60'
    }
    if (l.categoria === 'NotasEmitidas') return '#333333'
    return '#27ae60'
  }

  const lancamentosFiltrados = lancamentos.filter(l => 
    l.ano === anoSelecionado &&
    l.mes === mesSelecionado &&
    l.categoria === categoriaAtiva &&
    l.descricao.toLowerCase().includes(busca.toLowerCase())
  )

  // Subdivisões Unicompen
  const itensPedidosNotas = lancamentosFiltrados.filter(l => l.tipoSub === 'Pedido' || l.tipoSub === 'Nota')
  const itensDevolucoes = lancamentosFiltrados.filter(l => l.tipoSub === 'Devolução')
  const itensEmHaver = lancamentosFiltrados.filter(l => l.tipoSub === 'Em Haver')
  const totalPedidosNotas = itensPedidosNotas.reduce((a, b) => a + b.valor, 0)
  const totalDevolucoes = itensDevolucoes.reduce((a, b) => a + b.valor, 0)
  const totalEmHaver = itensEmHaver.reduce((a, b) => a + b.valor, 0)
  const balancoUnicompenFinal = (totalPedidosNotas - totalDevolucoes) - totalEmHaver

  // Total Caixa (Apenas Saídas)
  const totalCaixaSaidas = lancamentosFiltrados.reduce((a, b) => a + b.valor, 0)

  // Outros totais
  const totalGeralOutros = lancamentosFiltrados.reduce((acc, item) => {
    if ((item.categoria === 'BancoPJ' || item.categoria === 'Caixa') && item.tipoSub === 'Saída') return acc - item.valor
    return acc + item.valor
  }, 0)

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Topo com Ano */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#8E3E23', margin: 0 }}>Controle Financeiro</h2>
          <p style={{ color: '#666', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
            Histórico financeiro e gestão de caixa por ano e mês
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#8E3E23', display: 'block', marginBottom: '0.2rem' }}>ANO BASE</label>
            <select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #E2A684', fontWeight: 'bold', color: '#8E3E23', background: '#fff', cursor: 'pointer' }}
            >
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <button
            onClick={abrirModalNovo}
            style={{
              backgroundColor: '#C05B35',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            + Novo Lançamento
          </button>
        </div>
      </div>

      {/* Seletor de Meses */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        {meses.map(m => (
          <button
            key={m}
            onClick={() => setMesSelecionado(m)}
            style={{
              background: mesSelecionado === m ? '#8E3E23' : '#fff',
              color: mesSelecionado === m ? '#fff' : '#555',
              border: '1px solid #E2A684',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: mesSelecionado === m ? 'bold' : 'normal',
              whiteSpace: 'nowrap'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Cards de Categorias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {categoriasPrincipais.map(cat => {
          const isAtivo = categoriaAtiva === cat.id
          return (
            <div
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              style={{
                background: isAtivo ? '#F8ECE4' : '#fff',
                border: isAtivo ? '2px solid #8E3E23' : '1px solid #E2A684',
                padding: '1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isAtivo ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{cat.icone}</div>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isAtivo ? '#8E3E23' : '#333', display: 'block' }}>
                {cat.nome}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Clique para detalhar</span>
            </div>
          )
        })}
      </div>

      {/* Área de Listagem e Balanço */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2A684', overflow: 'hidden' }}>
        <div style={{ background: '#F8ECE4', padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2A684', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ color: '#8E3E23', margin: 0, fontSize: '1.1rem' }}>
            {categoriasPrincipais.find(c => c.id === categoriaAtiva)?.nome} — {mesSelecionado} / {anoSelecionado}
          </h3>
          
          <div style={{ 
            fontWeight: 'bold', 
            color: categoriaAtiva === 'Unicompen' 
              ? (balancoUnicompenFinal > 0 ? '#e74c3c' : '#27ae60') 
              : '#27ae60', 
            fontSize: '1.1rem' 
          }}>
            {categoriaAtiva === 'Unicompen' 
              ? `Saldo Final: ${balancoUnicompenFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
              : categoriaAtiva === 'Caixa'
              ? `Total Saídas: ${totalCaixaSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
              : `Total: ${totalGeralOutros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            }
          </div>
        </div>

        <div style={{ padding: '1rem' }}>
          <input
            type="text"
            placeholder="Filtrar por descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', maxWidth: '320px', padding: '0.5rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '1.5rem', outline: 'none' }}
          />

          {categoriaAtiva === 'Unicompen' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#fdfbfb', padding: '1rem', borderRadius: '6px', border: '1px solid #E2A684', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', fontWeight: 'bold' }}>1. PEDIDOS E NOTAS (GASTOS)</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2980b9' }}>{totalPedidosNotas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', fontWeight: 'bold' }}>2.(-) DEVOLUÇÕES</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#e74c3c' }}>{totalDevolucoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#666', display: 'block', fontWeight: 'bold' }}>3.(-) ADIANTE. EM HAVER</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27ae60' }}>{totalEmHaver.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div style={{ borderLeft: '2px solid #E2A684' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8E3E23', display: 'block', fontWeight: 'bold' }}>SALDO FINAL</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: balancoUnicompenFinal > 0 ? '#e74c3c' : '#27ae60' }}>
                    {balancoUnicompenFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Pedidos e Notas */}
              <div style={{ border: '1px solid #2980b9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ background: '#eaf2f8', padding: '0.6rem 1rem', fontWeight: 'bold', color: '#2980b9', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📦 Pedidos e Notas (Gastos)</span>
                  <span>{totalPedidosNotas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                {itensPedidosNotas.length === 0 ? <p style={{ padding: '1rem', color: '#888', fontStyle: 'italic', margin: 0 }}>Nenhum pedido ou nota registrado.</p> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                      {itensPedidosNotas.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                          <td style={{ padding: '0.6rem 1rem', color: '#666', width: '120px' }}>{l.data}</td>
                          <td style={{ padding: '0.6rem 1rem', width: '110px' }}>
                            <span style={{ background: l.tipoSub === 'Pedido' ? '#e8f4fd' : '#fef9e7', color: l.tipoSub === 'Pedido' ? '#2980b9' : '#d4ac0d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              {l.tipoSub}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 1rem', color: '#333', fontWeight: '500' }}>{l.descricao}</td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#2980b9', width: '150px' }}>{l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'center', width: '130px' }}>
                            <button onClick={() => abrirModalEditar(l)} style={{ background: 'transparent', border: '1px solid #2980b9', color: '#2980b9', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem', marginRight: '5px' }}>Editar</button>
                            <button onClick={() => handleExcluir(l.id)} style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}>Excluir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Devoluções */}
              <div style={{ border: '1px solid #e74c3c', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '0.6rem 1rem', fontWeight: 'bold', color: '#e74c3c', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🔄 Devoluções (Abatimento)</span>
                  <span>{totalDevolucoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                {itensDevolucoes.length === 0 ? <p style={{ padding: '1rem', color: '#888', fontStyle: 'italic', margin: 0 }}>Nenhuma devolução registrada.</p> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                      {itensDevolucoes.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                          <td style={{ padding: '0.6rem 1rem', color: '#666', width: '120px' }}>{l.data}</td>
                          <td style={{ padding: '0.6rem 1rem', color: '#333', fontWeight: '500' }}>{l.descricao}</td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#e74c3c', width: '150px' }}>{l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'center', width: '130px' }}>
                            <button onClick={() => abrirModalEditar(l)} style={{ background: 'transparent', border: '1px solid #2980b9', color: '#2980b9', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem', marginRight: '5px' }}>Editar</button>
                            <button onClick={() => handleExcluir(l.id)} style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}>Excluir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Em Haver */}
              <div style={{ border: '1px solid #27ae60', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(39, 174, 96, 0.1)', padding: '0.6rem 1rem', fontWeight: 'bold', color: '#27ae60', display: 'flex', justifyContent: 'space-between' }}>
                  <span>⏳ Em Haver / Adiantamentos (Crédito)</span>
                  <span>{totalEmHaver.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                {itensEmHaver.length === 0 ? <p style={{ padding: '1rem', color: '#888', fontStyle: 'italic', margin: 0 }}>Nenhum item em haver registrado.</p> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                      {itensEmHaver.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                          <td style={{ padding: '0.6rem 1rem', color: '#666', width: '120px' }}>{l.data}</td>
                          <td style={{ padding: '0.6rem 1rem', color: '#333', fontWeight: '500' }}>{l.descricao}</td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 'bold', color: '#27ae60', width: '150px' }}>{l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'center', width: '130px' }}>
                            <button onClick={() => abrirModalEditar(l)} style={{ background: 'transparent', border: '1px solid #2980b9', color: '#2980b9', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem', marginRight: '5px' }}>Editar</button>
                            <button onClick={() => handleExcluir(l.id)} style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', padding: '0.1rem 0.4rem', cursor: 'pointer', fontSize: '0.75rem' }}>Excluir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: '#555', borderBottom: '1px solid #ddd', fontSize: '0.9rem' }}>
                  <th style={{ padding: '0.7rem' }}>Data</th>
                  {categoriaAtiva !== 'NotasEmitidas' && <th style={{ padding: '0.7rem' }}>Tipo</th>}
                  <th style={{ padding: '0.7rem' }}>Descrição / Cliente</th>
                  <th style={{ padding: '0.7rem', textAlign: 'right' }}>Valor</th>
                  <th style={{ padding: '0.7rem', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lancamentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                      Nenhum lançamento registrado nesta categoria para {mesSelecionado} / {anoSelecionado}.
                    </td>
                  </tr>
                ) : (
                  lancamentosFiltrados.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                      <td style={{ padding: '0.7rem', color: '#666' }}>{l.data}</td>
                      {categoriaAtiva !== 'NotasEmitidas' && (
                        <td style={{ padding: '0.7rem', fontWeight: 'bold', color: l.tipoSub === 'Saída' ? '#e74c3c' : '#2980b9' }}>
                          {l.tipoSub}
                        </td>
                      )}
                      <td style={{ padding: '0.7rem', color: '#333', fontWeight: '500' }}>{l.descricao}</td>
                      <td style={{ padding: '0.7rem', textAlign: 'right', fontWeight: 'bold', color: obterCorValor(l) }}>
                        {l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td style={{ padding: '0.7rem', textAlign: 'center' }}>
                        <button
                          onClick={() => abrirModalEditar(l)}
                          style={{ background: 'transparent', border: '1px solid #2980b9', color: '#2980b9', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem', marginRight: '5px' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(l.id)}
                          style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Novo / Editar Lançamento */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '450px', border: '1px solid #E2A684' }}>
            <h3 style={{ color: '#8E3E23', marginTop: 0, marginBottom: '0.5rem' }}>
              {editandoId ? 'Editar Lançamento' : 'Novo Lançamento'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
              Destino: <strong>{categoriasPrincipais.find(c => c.id === novoItem.categoria)?.nome}</strong> ({mesSelecionado} / {anoSelecionado})
            </p>
            
            <form onSubmit={handleSalvarLancamento}>
              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Categoria / Seção</label>
                <select
                  value={novoItem.categoria}
                  onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {categoriasPrincipais.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              {novoItem.categoria === 'Unicompen' && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Tipo de Movimento</label>
                  <select
                    value={novoItem.tipoSub}
                    onChange={(e) => setNovoItem({ ...novoItem, tipoSub: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Pedido">Pedido</option>
                    <option value="Nota">Nota</option>
                    <option value="Devolução">Devolução</option>
                    <option value="Em Haver">Em Haver</option>
                  </select>
                </div>
              )}

              {['BancoPJ', 'BancoJorge', 'Dinheiro'].includes(novoItem.categoria) && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Tipo de Lançamento</label>
                  <select
                    value={novoItem.tipoSub}
                    onChange={(e) => setNovoItem({ ...novoItem, tipoSub: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Parcela">Parcela</option>
                    <option value="Quitação">Quitação</option>
                    {novoItem.categoria === 'BancoPJ' && <option value="Saída">Saída</option>}
                  </select>
                </div>
              )}

              {novoItem.categoria === 'Caixa' && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Comprovante de Saída</label>
                  <select
                    value={novoItem.tipoCaixaOp}
                    onChange={(e) => setNovoItem({ ...novoItem, tipoCaixaOp: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Nota">Nota</option>
                    <option value="Recibo">Recibo</option>
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Dia do Mês (Ex: 08)</label>
                <input
                  type="text"
                  placeholder="08"
                  maxLength="2"
                  value={novoItem.dia}
                  onChange={(e) => setNovoItem({ ...novoItem, dia: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              {novoItem.categoria === 'Unicompen' && novoItem.tipoSub === 'Pedido' && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Número do Pedido</label>
                  <input
                    type="text"
                    placeholder="Ex: 1042"
                    value={novoItem.numeroPedido}
                    onChange={(e) => setNovoItem({ ...novoItem, numeroPedido: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              {(['NotasEmitidas', 'BancoJorge', 'Dinheiro'].includes(novoItem.categoria) || (novoItem.categoria === 'BancoPJ' && novoItem.tipoSub !== 'Saída')) && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Cliente Vinculado</label>
                  <select
                    value={novoItem.clienteId}
                    onChange={(e) => setNovoItem({ ...novoItem, clienteId: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Selecione o Cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              )}

              {novoItem.categoria === 'Caixa' && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Fornecedor</label>
                  <input
                    type="text"
                    placeholder="Nome do fornecedor"
                    value={novoItem.fornecedor}
                    onChange={(e) => setNovoItem({ ...novoItem, fornecedor: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              {(novoItem.categoria === 'Unicompen' || (novoItem.categoria === 'BancoPJ' && novoItem.tipoSub === 'Saída')) && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>
                    {novoItem.categoria === 'BancoPJ' ? 'Para quem é a saída? (Manual)' : 'Descrição / Referência (Opcional)'}
                  </label>
                  <input
                    type="text"
                    placeholder={novoItem.categoria === 'BancoPJ' ? 'Ex: Fornecedor de ferragens' : 'Ex: Detalhes'}
                    value={novoItem.categoria === 'BancoPJ' ? novoItem.saidaPara : novoItem.descricao}
                    onChange={(e) => novoItem.categoria === 'BancoPJ' 
                      ? setNovoItem({ ...novoItem, saidaPara: e.target.value })
                      : setNovoItem({ ...novoItem, descricao: e.target.value })
                    }
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#8E3E23', marginBottom: '0.3rem' }}>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={novoItem.valor}
                  onChange={(e) => setNovoItem({ ...novoItem, valor: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  style={{ background: '#fff', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: '#C05B35', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {editandoId ? 'Salvar Alterações' : 'Salvar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Financeiro