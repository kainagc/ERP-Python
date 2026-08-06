// src/App.jsx
import { useState } from 'react'
import { Header } from './components/Header.jsx'
import { Home } from './pages/Home.jsx'
import { Clientes } from './pages/Clientes.jsx'
import { Projetos } from './pages/Projetos.jsx'
import { Financeiro } from './pages/Financeiro.jsx'
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
      {paginaAtual === 'financeiro' && <Financeiro />}
      {paginaAtual === 'orcamento' && <div style={{ padding: '2rem' }}><h1>Em breve: Orçamentos</h1></div>}
      {paginaAtual === 'estoque' && <div style={{ padding: '2rem' }}><h1>Em breve: Estoque</h1></div>}
    </div>
  )
}

export default App

