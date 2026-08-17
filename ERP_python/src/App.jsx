// src/App.jsx
import { useState } from 'react'
import { Header } from './components/Header.jsx'
import { Home } from './pages/Home.jsx'
import { Clientes } from './pages/Clientes.jsx'
import { Projetos } from './pages/Projetos.jsx'
import { Financeiro } from './pages/Financeiro.jsx'
import { Orcamento } from './pages/Orcamento.jsx'
import { Estoque } from './pages/Estoque.jsx'
import { Novo_Cliente } from './pages/Novo_Cliente.jsx'
import { Novo_Projeto } from './pages/Novo_Projeto.jsx'
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
      {paginaAtual === 'clientes' && <Clientes aoNavegar={setPaginaAtual} />}
      {paginaAtual === 'projetos' && <Projetos aoNavegar={setPaginaAtual}/>}
      {paginaAtual === 'financeiro' && <Financeiro />}
      {paginaAtual === 'orcamento' && <Orcamento/>}
      {paginaAtual === 'estoque' && <Estoque/>}
      {paginaAtual === 'novo-cliente' && <Novo_Cliente aoNavegar={setPaginaAtual}/>}
      {paginaAtual === 'novo-projeto' && <Novo_Projeto aoNavegar={setPaginaAtual}/>}
    </div>
  )
}

export default App

