// src/App.jsx
import { useState } from 'react'
import { Header } from './components/Header.jsx'
import { Home } from './pages/Home.jsx'
import { Clientes } from './pages/Clientes.jsx'
import { Projetos } from './pages/Projetos.jsx'
import { Financeiro } from './pages/Financeiro.jsx'
import { Orcamento } from './pages/Orcamento.jsx'
import { Estoque } from './pages/Estoque.jsx'
import { FinanceiroEntrada } from './pages/FinanceiroEntrada.jsx'
import { FinanceiroSaida } from './pages/FinanceiroSaida.jsx'
import { FinanceiroNotas } from './pages/FinanceiroNotas.jsx'
import './App.css'

export function App() {
  // Guarda o nome da página atual (inicia exibindo a 'home')
  const [paginaAtual, setPaginaAtual] = useState('home')

  return (
    <div style={{ padding: '0rem', fontFamily: 'sans-serif' }}>
      {/* O Header fica sempre visível no topo */}
      <Header aoNavegar={setPaginaAtual} />

      {/* Condicionais para trocar de tela: */}
      {paginaAtual === 'home' && <Home />}
      {paginaAtual === 'clientes' && <Clientes />}
      {paginaAtual === 'projetos' && <Projetos />}
      {paginaAtual === 'financeiro' && <Financeiro aoNavegar={setPaginaAtual} />}
          {paginaAtual === 'financeiro-entrada' && <FinanceiroEntrada />}
          {paginaAtual === 'financeiro-saida' && <FinanceiroSaida />}
          {paginaAtual === 'financeiro-notas' && <FinanceiroNotas />}

      {paginaAtual === 'orcamento' && <Orcamento/>}
      {paginaAtual === 'estoque' && <Estoque/>}
    </div>
  )
}

export default App

