// src/App.jsx
import { Routes, Route } from 'react-router-dom'
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
  return (
    <div style={{ padding: '0rem', fontFamily: 'sans-serif' }}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/novo" element={<Novo_Cliente />} />
        <Route path="/clientes/:id" element={<Editar_Cliente />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/projetos/novo" element={<Novo_Projeto />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </div>
  )
}

export default App