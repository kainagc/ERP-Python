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
import { Editar_Cliente } from './pages/Editar_Cliente.jsx'
import { Novo_Projeto } from './pages/Novo_Projeto.jsx'
import './App.css'

export function App() {
  const [paginaAtual, setPaginaAtual] = useState('home')
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState(null)

  function navegar(pagina, id = null) {
    setClienteSelecionadoId(id)
    setPaginaAtual(pagina)
  }

  return (
    <div style={{ padding: '0rem', fontFamily: 'sans-serif' }}>
      <Header aoNavegar={navegar} />

      {paginaAtual === 'home' && <Home />}
      {paginaAtual === 'clientes' && <Clientes aoNavegar={navegar} />}
      {paginaAtual === 'projetos' && <Projetos aoNavegar={navegar}/>}
      {paginaAtual === 'financeiro' && <Financeiro />}
      {paginaAtual === 'orcamento' && <Orcamento/>}
      {paginaAtual === 'estoque' && <Estoque/>}
      {paginaAtual === 'novo-cliente' && <Novo_Cliente aoNavegar={navegar}/>}
      {paginaAtual === 'editar-cliente' && <Editar_Cliente aoNavegar={navegar} clienteId={clienteSelecionadoId} />}
      {paginaAtual === 'novo-projeto' && <Novo_Projeto aoNavegar={navegar}/>}
    </div>
  )
}

export default App