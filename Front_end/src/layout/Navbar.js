/*   Barra de Navegação */

import {Link} from 'react-router-dom'
import Container from './Container'
import styles from './Navbar.module.css'
import logo from '../assets/logo.png'

function Navbar(){

return(
  <nav class={styles.navbar}>
    <Container>
    <Link to="/">
      <img src={logo} alt="logo "/>
    </Link>
    <ul className={styles.list}>
      <li className={styles.item}>
    <Link to="/">HOME</Link>
    </li>
  
    <li className={styles.item}>
    <Link to="/copas">Copas</Link>
    </li>

    <li className={styles.item}>
    <Link to="/idiomas">Idiomas</Link>
    </li>
   

    <li className={styles.item}>
    <Link to="/tipolance">Tipo de Lance</Link>
    </li>

    <li className={styles.item}>
    <Link to="/lance">Lance</Link>
    </li>
    
    <li className={styles.item}>
    <Link to="/continente">Continente</Link>
    </li>

    <li className={styles.item}>
    <Link to="/paissede">Pais Sede</Link>
    </li>

    <li className={styles.item}>
    <Link to="/tecnico">Técnico</Link>
    </li>

    <li className={styles.item}>
    <Link to="/selecao">Seleção</Link>
    </li>

    </ul>
    </Container>
  </nav>

)

}

export default Navbar