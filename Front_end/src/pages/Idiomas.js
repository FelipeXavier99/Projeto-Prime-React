/* idioma estaá ok  */

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../pages_css/Idioma.module.css';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core';


function getIdIdioma (){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);	
  const idIdioma = urlParams.get('idIdioma');
  return idIdioma		
}


function Idioma() {
  const [copa, setCopas] = useState([]);

  useEffect(() => {
    const idIdioma = getIdIdioma();
    axios.get(`http://localhost:3001/idioma?idIdioma=${idIdioma}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/idioma")
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deletarIdioma = (idIdioma) => {
    axios
      .delete(`http://localhost:3001/deleteIdioma/${idIdioma}`)
      .then((response) => {
        console.log("Idioma excluído com sucesso");
        // Atualize o estado da lista de idiomas após a exclusão
        setCopas((prevCopas) => prevCopas.filter((idioma) => idioma.id_idioma !== idIdioma));
      })
      .catch((error) => {
        console.log("Erro ao excluir idioma:", error);
      });
  };

  return (
    <section className={styles.idioma_container}>
      <h2>Tabela de idioma</h2>

      <Button
        component={Link}
        to="/EditIdioma"
        className={`${styles.inserir_movedown}`}
        variant="contained"
        color="primary"
      >
        INSERIR IDIOMA
      </Button>

      <table>
        <thead>
          <tr>
            <th className={styles.cor_cabecalho}>Idioma</th>
            <th2 className={styles.cor_cabecalho}>Ações</th2>
          </tr>
        </thead>
        <tbody>
          {copa.map((idioma) => (
            <tr key={idioma.id_idioma}>
              <td>{idioma.nome}</td>
              <td>
                <div className={styles.button_container}>
                  <button className={styles.edit_button}>
                    <Link to={`/EditIdioma?idIdioma=${idioma.id_idioma}`}>
                      Editar
                    </Link>
                  </button>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <button
                      className={styles.delete_button}
                      onClick={() => deletarIdioma(idioma.id_idioma)}
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Idioma;
