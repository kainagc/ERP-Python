import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header.jsx'
import { Home } from './pages/Home.jsx'
import { Clientes } from './pages/Clientes.jsx'
import { Novo_Cliente } from './pages/Novo_Cliente.jsx'
import { Editar_Cliente } from './pages/Editar_Cliente.jsx'
import { Projetos } from './pages/Projetos.jsx'
import { Novo_Projeto } from './pages/Novo_Projeto.jsx'
import { Editar_Projeto } from './pages/Editar_Projeto.jsx'
import { Orcamento } from './pages/Orcamento.jsx'
import { Financeiro } from './pages/Financeiro.jsx'
import { Estoque } from './pages/Estoque.jsx'
import './App.css'

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Clientes */}
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/novo_cliente" element={<Novo_Cliente />} />
        <Route path="/clientes/:id" element={<Editar_Cliente />} />

        {/* Projetos */}
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/novo_projeto" element={<Novo_Projeto />} />
        <Route path="/projetos/:id" element={<Editar_Projeto />} />

        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </>
  )
}

export default App