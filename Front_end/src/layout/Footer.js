/* Rodapé */

import { FaFacebook, FaInstagram} from 'react-icons/fa';
import styles from './Footer.module.css';

function Footer() {
  return (
    
    //Chamando o CSS
    <footer className={styles.footer}>
      <ul>
        <li>
          <FaFacebook />
        </li>
      </ul>

      <ul>
        <li>
          <FaInstagram />
        </li>
      </ul>
      <p> <span>Xavier</span>&copy;2023</p>
    </footer>
  );
}

export default Footer;
