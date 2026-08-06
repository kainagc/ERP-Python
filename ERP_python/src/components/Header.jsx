// src/components/Header.jsx
import './Header.css'

export function Header({ aoNavegar }) {
  return (
    <header className="header-principal">
      {/* Botão para voltar para a tela inicial se clicar no título/logo */}
      <button onClick={() => aoNavegar('home')}>Home</button> 

      <button onClick={() => aoNavegar('clientes')}>Clientes</button>
      <button onClick={() => aoNavegar('projetos')}>Projetos</button>
      <button onClick={() => aoNavegar('financeiro')}>Financeiro</button>
      <button onClick={() => aoNavegar('orcamento')}>Orçamento</button>
      <button onClick={() => aoNavegar('estoque')}>Estoque</button>
    </header>
  )
}