// src/components/Header.jsx
import { Link } from 'react-router-dom'
import './Header.css'

export function Header() {
  return (
    <header className="header-principal">
      <Link to="/">Home</Link>
      <Link to="/clientes">Clientes</Link>
      <Link to="/projetos">Projetos</Link>
      <Link to="/orcamento">Orçamento</Link>
      <Link to="/financeiro">Financeiro</Link>
      <Link to="/estoque">Estoque</Link>
    </header>
  )
}