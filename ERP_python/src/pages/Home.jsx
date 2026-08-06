// src/pages/Home.jsx
import Logo from '../assets/logo.png'
import './Home.css'

export function Home() {
  return (
    <div>
      <div className='dashbordlogo'>
        <img className='logo' src={Logo} alt="Logo" />
      </div>

      <div className='dashbord'>
        <div className='painel1'></div>
        <div className='painel2'></div>
      </div>
    </div>
  )
}

export default Home